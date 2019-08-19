import DlgBase from "../../../common/DlgBase";
import LayerOptsDanDong from "./LayerOptsDanDong";
import { ILayerOpts } from "./ILayerOpts";

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

interface togglePair
{
    toggle : cc.Toggle ;
    layerOpts : ILayerOpts ;
} ;

@ccclass
export default class DlgCreateRoom extends DlgBase {

    @property(cc.Toggle)
    mToggleDanDong : cc.Toggle = null;

    @property(LayerOptsDanDong)
    mLayerOptsDanDong : LayerOptsDanDong = null ;

    vTogglePairs : togglePair[] = [] ;

    @property( [cc.Component.EventHandler ] )
    onDlgResult : cc.Component.EventHandler[] = [] ; // ( opts : IOpts )
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        super.onLoad();
        // setup Pairs ; 
        let p : togglePair = { toggle : this.mToggleDanDong, layerOpts : this.mLayerOptsDanDong } ;
        this.vTogglePairs.push(p);

        // init state;
        this.onSelectGame();
    }

    start () {
        
    }

    onSelectGame()
    {
        for ( let pair of this.vTogglePairs )
        {
            pair.layerOpts.node.active = pair.toggle.isChecked;
        }
    }

    onBtnDoCreate()
    {
        for ( let pair of this.vTogglePairs )
        {
            if ( pair.toggle.isChecked )
            {
                cc.Component.EventHandler.emitEvents( this.onDlgResult,pair.layerOpts.getOpts() ) ;
                break ;
            }
        }
        this.closeDlg();
    }

    // update (dt) {}
}
