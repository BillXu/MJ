import DlgBase from "../../../common/DlgBase";
import PlayerInfoItem from "../../../commonItem/PlayerInfoItem";
import PlayerInfoDataCacher from "../../../clientData/PlayerInfoDataCacher";
import PlayerInfoData from "../../../clientData/playerInfoData";
import GPSManager from "../../../sdk/GPSManager";
import { ILocationDlgData } from "./ILayerDlgData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgLocation extends DlgBase {

    @property([PlayerInfoItem])
    mPlayers : PlayerInfoItem[] = [] ;

    @property([cc.Node])
    mUnknownGPSIcons : cc.Node[] = [] ;

    @property([cc.Label])
    mDistanceLabes : cc.Label[] = [] ;

    // player 3 
    @property([PlayerInfoItem])
    mPlayersSeat3 : PlayerInfoItem[] = [] ;

    @property([cc.Node])
    mUnknownGPSIconsSeat3 : cc.Node[] = [] ;

    @property([cc.Label])
    mDistanceLabesSeat3 : cc.Label[] = [] ;
    
    @property(cc.Node)
    mLocationLayer : cc.Node = null ;


    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData);
        let data = <ILocationDlgData>jsUserData ;
        this.refresh( data );
    }

    protected refresh( data : ILocationDlgData ) : void
    {
        let setaCnt = data.seatCnt ;
        let vPlayers = setaCnt == 4 ? this.mPlayers : this.mPlayersSeat3;
        let vDistanceLabes = setaCnt == 4 ? this.mDistanceLabes : this.mDistanceLabesSeat3 ;
        let vUnknownGPSIcon = setaCnt == 4 ? this.mUnknownGPSIcons : this.mUnknownGPSIconsSeat3 ;
        this.mLocationLayer.position = setaCnt == 4 ? cc.Vec2.ZERO : cc.v2(0,-88);

        let selfIdx = data.getSelfIdx() ;
        selfIdx = selfIdx == -1 ? 0 : selfIdx ;
        let distanceIdx = 0 ;
        let vPlayerUIDs = data.getPlayerUIDs();
        for ( let idx = 0 ; idx < setaCnt ; ++idx )
        {
            let realIdx = ( selfIdx + idx ) % setaCnt ;
            vPlayers[idx].node.active = true;
            let nCurUID : number = -1 ;
            if ( vPlayerUIDs[realIdx] == -1 )
            {
                vPlayers[idx].clear();
                vUnknownGPSIcon[idx].active = false;
            }
            else
            {
                nCurUID = vPlayerUIDs[realIdx] ;
                vPlayers[idx].refreshInfo( nCurUID ) ;
                vUnknownGPSIcon[idx].active = false; 
                let pd = PlayerInfoDataCacher.getInstance().getPlayerInfoByID( nCurUID );
                if ( null != pd )
                {
                    vUnknownGPSIcon[idx].active = ( pd.GPS_J < 1 || pd.GPS_W < 1 );
                }
            }

            // caculate distance 
            for ( let targetIdx = idx + 1 ; targetIdx < setaCnt ; ++targetIdx )
            {
                let targetSvrIdx = (selfIdx + targetIdx) % setaCnt ;
                let isNoNeedCaculateDis : boolean = nCurUID == -1 || vPlayerUIDs[targetSvrIdx] == -1 ;
                let curData : PlayerInfoData = null ,targetData : PlayerInfoData = null;
                if ( isNoNeedCaculateDis == false )
                {
                    let pTUID = vPlayerUIDs[targetSvrIdx] ;
                    curData = PlayerInfoDataCacher.getInstance().getPlayerInfoByID(pTUID);
                    targetData = PlayerInfoDataCacher.getInstance().getPlayerInfoByID(pTUID);
                    isNoNeedCaculateDis = curData == null || targetData == null || ( curData.GPS_J < 1 || curData.GPS_W < 1 ) || ( targetData.GPS_J < 1 || targetData.GPS_W < 1 ) ;
                }

                if ( isNoNeedCaculateDis )
                {
                    vDistanceLabes[distanceIdx].string = "未知距离" ;
                }
                else
                {
                    vDistanceLabes[distanceIdx].string = GPSManager.getInstance().caculateDistance(curData.GPS_J,curData.GPS_W,targetData.GPS_J ,targetData.GPS_W ) + "米" ;
                }
if ( CC_DEBUG || CC_DEV )
{
                if ( null != targetData && null != curData )
                {
                    vDistanceLabes[distanceIdx].string += targetData.name + " AND " + curData.name ;
                }
}

                vDistanceLabes[distanceIdx].node.parent.parent.active = true;
                ++distanceIdx ;
            }
        }
    }
    // update (dt) {}
}
