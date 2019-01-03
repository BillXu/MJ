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
export default class CheckHotUpdate extends cc.Component {

    @property(cc.Label)
    pProgressInfo: cc.Label = null;

    @property({ type : cc.Asset,})
    manifestUrl : cc.Asset = null ;

    @property(cc.Node)
    pBtnRetry : cc.Node = null ;

    @property(cc.Node)
    pBtnUpdateRightNow : cc.Node = null ;

    @property(cc.Node)
    pHotUpdatePannel : cc.Node = null ;

    @property(cc.ProgressBar)
    pProgress : cc.ProgressBar = null ; 

    isUpdateing : boolean = false ;
    _storagePath : string = "" ;
    _canRetry : boolean = false ;
    // LIFE-CYCLE CALLBACKS:
    pAssertManager : any =  null ;//new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
    onLoad () 
    {

        this.setUpAssertMgr();
        cc.game.on(cc.game.EVENT_SHOW,this.checkUpdate,this) ;
    }

    start () {
        if ( CC_JSB && cc.sys.ANDROID )
        {
            this.checkUpdate();
        }
    }

    protected setUpAssertMgr()
    {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }

        if ( this.pAssertManager )
        {
            return ;
        }

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset');
        console.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        let versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this.pAssertManager = new jsb.AssetsManager('', this._storagePath, versionCompareHandle );

        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this.pAssertManager.setMaxConcurrentTask(2);
        }
    }

    checkUpdate()
    {
        console.log( "检查热更新" );
        if (this.isUpdateing) {
            console.log( "已经在更新了检查热更新" );
            return;
        }

        this.setUpAssertMgr();
        if (this.pAssertManager.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this.pAssertManager.loadLocalManifest(url);
        }
        if (!this.pAssertManager.getLocalManifest() || !this.pAssertManager.getLocalManifest().isLoaded()) {
             console.error('Failed to load local manifest ...');
            return;
        }
        this.pAssertManager.setEventCallback(this.checkCb.bind(this));

        this.isUpdateing = true;
        this.pAssertManager.checkUpdate();
    }

    protected checkCb( event : any ) {
        console.log('checkCb Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.pProgressInfo.string = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.pProgressInfo.string = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.pProgressInfo.string = "Already up to date with the latest remote version.";
                this.finishHotUpdate();
                return ;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.pProgressInfo.string = '发现新版本：' + this.pAssertManager.getTotalBytes() / 1000 + "M";
                this.pHotUpdatePannel.active = true ;
                this.pBtnUpdateRightNow.active = true ;
                break; 
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                {
                    var msg = event.getMessage();
                    if (msg) {
                        //this.panel.info.string = 'Updated file: ' + msg;
                        console.log(  "check call back"  + event.getPercent()/100 + '% : ' + msg);
                    }
                }
                return;
            default:
                return;
        }
        
        this.pAssertManager.setEventCallback(null);
        this.isUpdateing = false;
    }

    doUpdate()
    {
        if (this.pAssertManager && !this.isUpdateing) {
            this.pAssertManager.setEventCallback(this.updateCb.bind(this));

            if (this.pAssertManager.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this.pAssertManager.loadLocalManifest(url);
            }

            this.pAssertManager.update();
            this.isUpdateing = true;
            this.pBtnRetry.active = false;
            this.pBtnUpdateRightNow.active = false ;
            console.log( "do update act" );
        }
        else
        {
            console.error( "should not click update btn" );
        }
    }

    protected updateCb( event : any )
    {
        let needRestart = false;
        let failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.pProgressInfo.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                //this.panel.byteProgress.progress = event.getPercent();
                //this.panel.fileProgress.progress = event.getPercentByFile();

                //this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.pProgressInfo.string = "已经下载资源:" + event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    //this.panel.info.string = 'Updated file: ' + msg;
                    console.log(event.getPercent()/100 + '% : ' + msg);
                }
                this.pProgress.progress = event.getPercent() / 100 ;
                this.pProgress.node.active = true ;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.pProgressInfo.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.pProgressInfo.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.pProgressInfo.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.pProgressInfo.string = 'Update failed. ' + event.getMessage();
                this.pBtnRetry.active = true;
                this.isUpdateing = false;
                this._canRetry = true ;
                this.pProgress.node.active = false ;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.pProgressInfo.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.pProgressInfo.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this.pAssertManager.setEventCallback(null);
            this.isUpdateing = false;
        }

        if (needRestart) {
            this.pAssertManager.setEventCallback(null);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this.pAssertManager.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }

    retry()
    {
        if (!this.isUpdateing && this._canRetry) {
            this.pBtnRetry.active = false;
            this._canRetry = false;
            
            this.pProgressInfo.string = 'Retry failed Assets...';
            this.pAssertManager.downloadFailedAssets();
        }
    }

    onDestroy() {
        if ( this.pAssertManager )
        {
            this.pAssertManager.setEventCallback(null);
        }
    }

    protected finishHotUpdate()
    {
        this.pAssertManager = null ;
        this.isUpdateing = false;
    }
    // update (dt) {}
}
