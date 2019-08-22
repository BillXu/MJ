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

@ccclass
export default class PlayerInfoData {

    protected playerBrifeDataMsg : Object = null ;
    
    initByMsg( js : Object )
    {
        this.playerBrifeDataMsg = js ;
    }

    get uid () : number
    {
        return this.playerBrifeDataMsg["uid"] ;
    }

    get name() : string
    {
        return this.playerBrifeDataMsg["name"] ;
    }

    set name( n : string ) 
    {
        this.playerBrifeDataMsg["name"] = n;
    }

    get headUrl () : string
    {
        return this.playerBrifeDataMsg["headIcon"] ;
    }

    get gender() : number
    {
        return this.playerBrifeDataMsg["sex"] ;
    }

    set headUrl ( h : string )
    {
        this.playerBrifeDataMsg["headIcon"] = h ;
    }

    set gender( g : number )
    {
        this.playerBrifeDataMsg["sex"] = g ;
    }

    get ip() : string
    {
        return this.playerBrifeDataMsg["ip"] ;
    }

    get GPS_J() : number
    {
        return this.playerBrifeDataMsg["J"] ;
    }

    get GPS_W() : number
    {
        return this.playerBrifeDataMsg["W"] ;
    }

    get address() : string
    {
        if ( this.playerBrifeDataMsg["addre"] == null )
        {
            return "china";
        }
        return this.playerBrifeDataMsg["addre"] ;
    }
}
