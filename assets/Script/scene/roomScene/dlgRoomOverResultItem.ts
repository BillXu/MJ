// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import PhotoItem from "../../commonItem/photoItem"
@ccclass
export default class DlgRoomOverResultItem extends cc.Component {

    @property(PhotoItem)
    pHeadIcon: PhotoItem = null;

    @property(cc.Label)
    pName : cc.Label = null ;

    @property(cc.Label)
    pID : cc.Label = null ;

    @property(cc.Label)
    pBankerCnt : cc.Label = null ;
    
    @property(cc.Label)
    pHuCnt : cc.Label = null ;
    
    @property(cc.Label)
    pDianPaoCnt : cc.Label = null ;

    @property([cc.Node])
    vIdx_tag : cc.Node[] = [] ; // array idx = client idx ;

    @property(cc.Node)
    pRoomOwnerFlag : cc.Node = null ;

    @property(cc.Node)
    pBigWinerFlag : cc.Node = null ;
    
    @property(cc.Node)
    pBestDianPaoFlag : cc.Node = null ;
    
    @property(cc.Label)
    pFinalScoreWin : cc.Label = null ;

    @property(cc.Label)
    pFinalScoreLose : cc.Label = null ;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    pWinerBg : cc.Node = null ;

    nfinalScore : number = 0 ;
    nDianPaoCnt : number = 0 ;

    onLoad ()
    {
        this.reset();
    }

    reset()
    {
        this.pRoomOwnerFlag.active = false ;
        this.pBestDianPaoFlag.active = false ;
        this.pBigWinerFlag.active = false ;
        this.pWinerBg.active = false ;
        this.finalOffset = 0 ;
    }

    start () {

    }

    set name ( name : string )
    {
        this.pName.string = name ;
    }

    set headIcon( icon : string )
    {
        this.pHeadIcon.photoURL = icon ;
    }

    set uid ( uid : number )
    {
        this.pID.string = "ID:" + uid;
    }

    set isRoomOwner( isOwner : boolean )
    {
        this.pRoomOwnerFlag.active = isOwner ;
    }

    set isBigWiner( isWiner : boolean )
    {
        this.pBigWinerFlag.active = isWiner ;
        this.pWinerBg.active = isWiner ;
    }

    set bankerCnt( cnt : number )
    {
        this.pBankerCnt.string = cnt.toString();
    }

    set huCnt( cnt : number )
    {
        this.pHuCnt.string = cnt.toString();
    }

    set dianPaoCnt( cnt : number )
    {
        this.pDianPaoCnt.string = cnt.toString();
        this.nDianPaoCnt = cnt ;
    }

    set isBestDianPao( isBest : boolean )
    {
        this.pBestDianPaoFlag.active = isBest ;
    }

    get dianPaoCnt() : number
    {
        return this.nDianPaoCnt;
    }

    set finalOffset ( cnt : number )
    {
        this.nfinalScore = cnt ;
        this.pFinalScoreLose.node.active = cnt < 0 ;
        this.pFinalScoreWin.node.active = !this.pFinalScoreLose.node.active;
        ( cnt < 0 ? this.pFinalScoreLose : this.pFinalScoreWin ).string = cnt.toString();
    }

    get finalOffset () : number
    {
        return this.nfinalScore ;
    }

    set clientIdx ( clientIdx : number )
    {
        this.vIdx_tag.forEach( ( tag : cc.Node, idx : number ) =>{  tag.active = idx == clientIdx ;} );
    }

    // update (dt) {}
}
