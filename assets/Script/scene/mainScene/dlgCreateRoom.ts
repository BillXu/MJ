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
import DlgBase from "../../common/DlgBase"
import * as _ from "lodash"
import { eGameType } from "../../common/clientDefine"
@ccclass
export default class DlgCreateRoom extends DlgBase {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Color)
    defToggleClr : cc.Color = cc.Color.RED ;

    @property(cc.Color)
    checkedToggleClr : cc.Color = cc.Color.RED ;

    @property([cc.Toggle])
    vMJTypeToggles :cc.Toggle[] = [] ;

    @property([cc.Toggle])
    vRoundToggles : cc.Toggle[] = [] ;

    @property([cc.Toggle])
    vCircleToggles :cc.Toggle[] = [] ;

    @property([cc.Toggle])
    vPayTypeToggles :cc.Toggle[] = [] ;

    @property([cc.Toggle])
    vPlayerCntToggles :cc.Toggle[] = [] ;

    @property(cc.Toggle)
    isEnableAvoidCheat : cc.Toggle = null ;

    @property(cc.Toggle)
    isEnableDuipu : cc.Toggle = null ;

    protected vOpts : Object[] = [] ;
    protected nCurMJTypeIdx : number = -1 ;
    
    onLoad () 
    {
        super.onLoad();
        for ( let nIdx = 0 ; nIdx < this.vMJTypeToggles.length ; ++nIdx )
        {
            let str = cc.sys.localStorage.getItem("mjopt" + nIdx );
            if ( str == null )
            {
                continue ;
            }
            this.vOpts[nIdx] = JSON.parse(str);
        }

       this.nCurMJTypeIdx = _.findIndex(this.vMJTypeToggles,( togle : cc.Toggle )=>{ return togle.isChecked ; });
       if ( this.nCurMJTypeIdx == -1 )
       {
           this.nCurMJTypeIdx = 0 ;
           this.vMJTypeToggles[0].isChecked = true ;
           cc.error( "why default no mj type is selected?" );
       }
       
       this.onRestoreMJOptsDisplay();
    }

    start () {

    }

    onSelectMJType( event : cc.Toggle, js : string )
    {
         let nMjIdx : number = parseInt(js);
         if ( nMjIdx < 0 || nMjIdx > this.vMJTypeToggles.length )
         {
             cc.error( "bind invalid mj type idx" );
             nMjIdx = 0 ;
         }

         if ( this.nCurMJTypeIdx == nMjIdx )
         {
             return ;
         }

         this.nCurMJTypeIdx = nMjIdx ;
         this.onRestoreMJOptsDisplay();
    }

    onSelectRoundType( event : cc.Toggle, js : string )
    {
        console.log( "onSelectRoundType" );
        this.vCircleToggles.forEach(( vtn : cc.Toggle )=>{ vtn.isChecked = false ; }) ;

        this.updateToggleLabelClr(this.vCircleToggles) ;
        this.updateToggleLabelClr(this.vRoundToggles);
    }

    onSelectCircleType( event : cc.Toggle, js : string )
    {
        console.log( "onSelectCircleType" );
        this.vRoundToggles.forEach(( vtn : cc.Toggle )=>{ vtn.isChecked = false ; }) ;

        this.updateToggleLabelClr(this.vCircleToggles) ;
        this.updateToggleLabelClr(this.vRoundToggles);
    }

    onSelectPayType( event : cc.Toggle, js : string )
    {
        this.updateToggleLabelClr(this.vPayTypeToggles) ;
    }

    onSelectPlayerCnt( event : cc.Toggle, js : string )
    {
         this.updateToggleLabelClr(this.vPlayerCntToggles) ;
    }

    onSelectOpt( tog : cc.Toggle, js : string )
    {
        let labelNode = tog.node.getChildByName("label");
        if ( null == labelNode )
        {
            cc.error( "toggle " + tog.node.name + "do not have label child" );
            return ;
        }
        labelNode.color = tog.isChecked ? this.checkedToggleClr : this.defToggleClr ;
    }

    onDoCreate( event : cc.Button )
    {
        // save opt idx ;
        let nRoundIdx = _.findIndex(this.vRoundToggles,( togle : cc.Toggle )=>{ return togle.isChecked ; });
        let nCircleIdx = _.findIndex(this.vCircleToggles,( togle : cc.Toggle )=>{ return togle.isChecked ; });
        let nPayTypeIdx = _.findIndex(this.vPayTypeToggles,( togle : cc.Toggle )=>{ return togle.isChecked ; });
        let nPlayerCntIdx = _.findIndex(this.vPlayerCntToggles,( togle : cc.Toggle )=>{ return togle.isChecked ; });
        
        if ( null == this.vOpts[this.nCurMJTypeIdx] )
        {
            this.vOpts[this.nCurMJTypeIdx] = {} ;
        }

        let jsOps = this.vOpts[this.nCurMJTypeIdx] ;

        jsOps["roundIdx"] = nRoundIdx ;
        jsOps["circleIdx"] = nCircleIdx ;
        jsOps["payTypeIdx"] = nPayTypeIdx ;
        jsOps["playerCntIdx"] = nPlayerCntIdx;
        jsOps["enableCheat"] = this.isEnableAvoidCheat.isChecked ? 1 : 0 ;
        jsOps["enableDuipu"] = this.isEnableDuipu.isChecked ? 1 : 0 ;
        cc.sys.localStorage.setItem("mjopt" + this.nCurMJTypeIdx , JSON.stringify(jsOps));
        // make create room msg send to svr ;
        let createMsg = {} ;
        let vGameType = [eGameType.eGame_CFMJ,eGameType.eGame_AHMJ,eGameType.eGame_NCMJ] ;
        createMsg["gameType"] = vGameType[this.nCurMJTypeIdx];
        createMsg["payType"] = nPayTypeIdx ;
        let level = 0 ;
        if ( nCircleIdx == -1 )
        {
            level = nRoundIdx ;
        }
        else
        {
            level = nCircleIdx + 2 ;
        }
        createMsg["level"] = level ;
        let vSeat = [2,3,4] ;
        createMsg["seatCnt"] = vSeat[nPlayerCntIdx] ;
        createMsg["circle"] = nRoundIdx == -1 ? 1 : 0 ;
        createMsg["guapu"] = this.isEnableDuipu.isChecked ? 1 : 0 ;
        this.pFuncResult(createMsg);
    }

    protected onRestoreMJOptsDisplay()
    {
        let jsOpts = this.vOpts[this.nCurMJTypeIdx] ;
        if ( jsOpts == null )
        {
            cc.log( "not save idx = " + this.nCurMJTypeIdx + " opts" );
            return ;
        }

        this.uncheckAllToggle(this.vRoundToggles);
        this.uncheckAllToggle(this.vCircleToggles);
        this.uncheckAllToggle(this.vPayTypeToggles);
        this.uncheckAllToggle(this.vPlayerCntToggles);
        // get all segment select idx ;
        let nRoundIdx = jsOpts["roundIdx"] ;
        if ( nRoundIdx > this.vRoundToggles.length )
        {
            cc.error( nRoundIdx + " round idx invalid mj = " + this.nCurMJTypeIdx );
            nRoundIdx = 0 ;
        }

        let nCirleIdx = jsOpts["circleIdx"] ;
        if ( nCirleIdx > this.vCircleToggles.length )
        {
            cc.error( nCirleIdx + " circle idx invalid mj = " + this.nCurMJTypeIdx );
            nCirleIdx = 0 ;
        }

        let nPayTypeIdx = jsOpts["payTypeIdx"] ;
        if ( nPayTypeIdx > this.vPayTypeToggles.length )
        {
            cc.error( nPayTypeIdx + " nPayTypeIdx idx invalid mj = " + this.nCurMJTypeIdx );
            nPayTypeIdx = 0 ;
        }

        let nPlayerCntIdx = jsOpts["playerCntIdx"] ;
        if ( nPlayerCntIdx > this.vPlayerCntToggles.length )
        {
            cc.error( nPlayerCntIdx + " player cnt idx invalid mj = " + this.nCurMJTypeIdx );
            nPlayerCntIdx = 0 ;
        }

        let bIsEnableCheat = jsOpts["enableCheat"] == 1 ;
        let bIsEnableDuiPu = jsOpts["enableDuipu"] == 1 ;

        if ( nRoundIdx != -1 )
        {
            this.vRoundToggles[nRoundIdx].isChecked = true ;
            this.onSelectRoundType(this.vRoundToggles[nRoundIdx],nRoundIdx.toString()) ;
        }
        else if ( nCirleIdx != -1 )
        {
            this.vCircleToggles[nCirleIdx].isChecked = true ;
            this.onSelectCircleType(this.vCircleToggles[nCirleIdx],nCirleIdx.toString()) ;
        }
        else
        {
            cc.error( "round idx and cirle is both invalid" );
        }

        this.vPayTypeToggles[nPayTypeIdx].isChecked = true ;
        this.vPlayerCntToggles[nPlayerCntIdx].isChecked = true ;
        this.isEnableAvoidCheat.isChecked = bIsEnableCheat ;
        this.isEnableDuipu.isChecked = bIsEnableDuiPu ;

        // update selecte color
        this.updateToggleLabelClr(this.vRoundToggles);
        this.updateToggleLabelClr(this.vCircleToggles);
        this.updateToggleLabelClr(this.vPayTypeToggles);
        this.updateToggleLabelClr(this.vPlayerCntToggles);
        let v : cc.Toggle[] = [this.isEnableAvoidCheat,this.isEnableDuipu ] ;
        this.updateToggleLabelClr(v);
    }

    protected updateToggleLabelClr( vToggles : cc.Toggle[] )
    {
        let self = this ;
        vToggles.forEach( ( tog : cc.Toggle)=>{
            let labelNode = tog.node.getChildByName("label");
            if ( null == labelNode )
            {
                cc.error( "toggle " + tog.node.name + "do not have label child" );
                return ;
            }
            labelNode.color = tog.isChecked ? self.checkedToggleClr : self.defToggleClr ;
        } ) ;
    }

    protected uncheckAllToggle( vToggles : cc.Toggle[] )
    {
        vToggles.forEach( ( tog : cc.Toggle)=>{
                tog.isChecked = false ;
        } ) ;
    }
    // update (dt) {}
}
