const {ccclass, property} = cc._decorator;
import * as _ from "lodash"
@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        this.label.string = this.text;
        let v = [{ "a" : 1 }];
        if ( _.isArray(v) )
        {
            this.label.string = "array" ;
        }
        else
        {
            this.label.string = "object" ;
        }
    }
}
