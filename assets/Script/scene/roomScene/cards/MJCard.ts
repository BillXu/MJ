import { eMJCardType } from "../roomDefine";

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

export enum MJCardState
{
    FACE_COVER,  // 麻将面盖着，就是牌墙的状态
    FACE_UP,   // 麻将面朝上，出了的牌，和碰了的牌那样。
    FACE_USER, // 麻将面朝向用户，通常手牌情况。       
} ;

@ccclass
export default class MJCard extends cc.Component {

   // Start is called before the first frame update
   public static MODEL_X_SIZE : number = 73.34 ;
   public static MODEL_Y_SIZE : number = 52.02 ;
   public static MODEL_Z_SIZE : number = 101.9 ;
   
   public cardNum : number = 0 ;
   
   get mjType() 
   {
        return MJCard.parseCardType(this.cardNum);
   }

   _state : MJCardState = MJCardState.FACE_COVER;

    set curState( value : MJCardState ) 
    { 
        this._state = value ;
        switch ( this._state )
        {
            case MJCardState.FACE_COVER:
            {
                this.node.eulerAngles = new cc.Vec3(0,0,180);
            }
            break;
            case MJCardState.FACE_UP:
            {
                this.node.eulerAngles = new cc.Vec3(0,180,0);
            }
            break ;
            case MJCardState.FACE_USER:
            {
                this.node.eulerAngles = new cc.Vec3(-90,180,0);
            }
            break ;
            default:
            {
                console.error("unknown state of mj = " + this._state);
            }
            break ;
        }
   }

   set isSelf( value : boolean )
   {
        this.node.group = value ? "self3D" : "3D" ;
   }

   get mjValue()
   {
        return MJCard.parseCardValue(this.cardNum);
   }

   // 把麻将看出一个盒子，以盒子的贴近屏幕的一面，左下角为参考点，世界坐标系 x,y,z 方向的大小，不用考虑麻将状态。
   public get world_x_Size()
   {
        return MJCard.MODEL_X_SIZE ;
   }

   public get world_y_Size()
   {
        switch ( this._state )
        {
            case MJCardState.FACE_COVER:
            {
                return MJCard.MODEL_Y_SIZE ;
            }
            case MJCardState.FACE_UP:
            {
                return MJCard.MODEL_Y_SIZE ;
            }
            case MJCardState.FACE_USER:
            {
                return MJCard.MODEL_Z_SIZE ;
            }
            default:
            {
                console.error("unknown state of mj = " + this._state);
            }
            break ;
        } 
        return 0 ;
   }

   public get world_z_Size()
   {
        switch ( this._state )
        {
            case MJCardState.FACE_COVER:
            {
                return MJCard.MODEL_Z_SIZE ;
            }
            case MJCardState.FACE_UP:
            {
                return MJCard.MODEL_Z_SIZE ;
            }
            case MJCardState.FACE_USER:
            {
                return MJCard.MODEL_Y_SIZE ;
            }
            default:
            {
                console.error("unknown state of mj = " + this._state);
            }
            break ;
        } 
        return 0 ;  
   }

   public static parseCardType( nCardNum : number  ) : eMJCardType
   {
       var nType = nCardNum & 0xF0 ;
       nType = nType >> 4 ;
       var type = <eMJCardType>nType ;
       if ( ( type < eMJCardType.eCT_Max && type > eMJCardType.eCT_None) == false )
       {
            console.error("parse card type error , cardnum = " + nCardNum) ;
       }

       return type ;
   }

   public static parseCardValue( nCardNumer : number ) : number
   {
       return  (nCardNumer & 0xF) ;
   }

   public static makeCardNum( type : eMJCardType , val : number ) : number
   {
       return (type << 4) | val ;
   }
}
