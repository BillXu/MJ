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
import PromptDlg from "./PromptDlg"
import PromptText from "./PromptText"
import DlgBase from "../common/DlgBase"
import * as _ from "lodash"
@ccclass
export default class Prompt extends cc.Component {

    @property(PromptDlg)
    pPromptDlg: PromptDlg = null;

    @property(cc.Prefab)
    pPromptTextPrefab: cc.Prefab = null;

    vDisplayingPromptText : cc.Node[] = [] ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showPromptText( text : string, nDisplayTime : number = 3 )
    {
        let p = cc.instantiate(this.pPromptTextPrefab);
        this.node.addChild(p);
        let pp : PromptText = p.getComponent(PromptText);
        let self = this ;
        pp.nDisplayTime = nDisplayTime ;
        pp.setText(text,(t : PromptText )=>{
            let idx = _.findIndex(self.vDisplayingPromptText,t.node) ;
            if ( idx == -1 )
            {
                cc.error( "why dont store it ?" );
                return ;
            }
            self.vDisplayingPromptText[idx] = null ;

            let notEmptyIdx = _.findIndex(self.vDisplayingPromptText,( node : cc.Node )=>{ return node != null ;} );
            if ( notEmptyIdx == -1 )
            {
                self.vDisplayingPromptText.length = 0 ;
            }
        }) ;

        let emptyIdx = _.findIndex(self.vDisplayingPromptText,( node : cc.Node )=>{ return node == null ;} );
        if ( emptyIdx != -1 )
        {
            this.vDisplayingPromptText[emptyIdx] = p ;
        }
        else
        {
            this.vDisplayingPromptText.push(p);
        }

        this.vDisplayingPromptText.forEach( ( pNode : cc.Node , idx : number )=>{
            if ( null == pNode )
            {
                return ;
            }
            pNode.position = cc.v2(0,-1 * (pNode.getContentSize().height * idx + 10) );
        } );

    }

    showDlg( dlgText : string , isOneBtn? : boolean, pfResult? : ( jsResult : Object ) => void , pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        if ( isOneBtn == null )
        {
            isOneBtn = true ;
        }
        this.pPromptDlg.isOneBtn = isOneBtn ;
        this.pPromptDlg.showDlg(pfResult,{ text : dlgText },pfOnClose ) ;
    }

    public static promptDlg( strDesc : string, isOneBtn? : boolean, pfResult? : ( jsResult : Object ) => void , pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        let node = cc.find("persisteNodeClientApp");
        let pompt = node.getComponent(Prompt);
        pompt.showDlg(strDesc,isOneBtn,pfResult,pfOnClose ) ;
    }

    public static promptText( strDesc : string , nDisplayTime : number = 2 )
    {
        let node = cc.find("persisteNodeClientApp");
        let pompt = node.getComponent(Prompt);
        pompt.showPromptText(strDesc,nDisplayTime) ;
    }
    // update (dt) {}
}
