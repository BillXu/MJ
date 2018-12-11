// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class  ClubMember
{
    uid : number = 0 ;
    msgBrefData : Object = null ;
    privliage : number = 0 ;
    isOnline : boolean = false ;
}

export default class ClubMemberData {

    vMembers : ClubMember[] = [] ;

    lpfCallBack : ( idx : number )=>void = null ;  // -1 means all ;

    onRecivedPlayerBrifData( msg : Object )
    {
        let uid = msg["uid"] ;
        let updateIdx = -1 ;
        this.vMembers.every( ( m : ClubMember , idx : number )=>{
            if ( m.uid == uid )
            {
                updateIdx = idx ;
                m.msgBrefData = msg ;
                return false ;
            }
            return true ;
        } ) ;

        if ( updateIdx != -1 && this.lpfCallBack )
        {
            this.lpfCallBack(updateIdx); 
        }
    }

    parseMemberData( msg : Object )
    {

    }
    // update (dt) {}
}
