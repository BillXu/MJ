const {ccclass, property} = cc._decorator;
import * as _ from "lodash"

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Node)
    pTestNode : cc.Node = null ;

    @property
    text: string = 'hello';

    vec : cc.Vec2 = cc.v2(0,0);
 
    log( strings : string  )
    {
        console.log(strings);
    }

    getVec() : cc.Vec2
    {
        return cc.v2(this.vec );
    }
    
    start () {
        let v = this.getVec();
        v.x = 100 ;
        console.log( "this is " + this.vec.x );

        let vt = this.vec ;
        vt.x = 200 ;
        console.log( "after " + this.vec.x );
        
       
 
        // let testString : string = "https://......" ;
        // let nPos : number = testString.indexOf("http");
        // console.log( "pos number = " + nPos );
        // // init logic
        // this.label.string = this.text;
        // let v = [{ "a" : 1 }];
        // if ( _.isArray(v) )
        // {
        //     this.label.string = "array" ;
        // }
        // else
        // {
        //     this.label.string = "object" ;
        // }

        // let vv = { a : "b" , c : 2 } ;
        // let b = { c : "d" } ;
        // _.merge(vv,b);

        // console.log(vv);
        // console.log("b---");
        // console.log(b);
        // async function foo() {
        //     var a = await new Promise((resolve) => {
        //         setTimeout(() => {
        //             resolve(1);
        //         }, 2000);
        //     });
        //     console.log(a); // 第2秒时输出: 1
        
        //     try {
        //         var b = await new Promise((resolve, reject) => {
        //             setTimeout(() => {
        //                 reject(2);
        //             }, 1000);
        //         })
        //     } catch (e) {
        //         console.log(e); // 第3秒时输出: 2
        //     }
        
        //     // 函数暂停2秒后再继续执行
        //     var sleep = await new Promise((resolve) => {
        //         setTimeout(() => {
        //             resolve('sleep');
        //         }, 2000);
        //     });
        
        //     console.log( typeof sleep );
        //     console.log( sleep );
        //     var c = await 3;
        //     console.log(c); // 第5秒时输出: 3


        //     var st = new Promise((resolve) => {
        //         setTimeout(() => {
        //             resolve('sleep ----');
        //         }, 2000);
        //     });
        //     console.log("haha---");
        //     st.then((v)=>{ console.log(v);}) ;
        //     console.log("haha--- end");
        // }
        
        // foo();
        // console.log("fool ok");
    }
}
