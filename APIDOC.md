<a name="OPC"></a>
## OPC
**Kind**: global class  

* [OPC](#OPC)
  * [new OPC()](#new_OPC_new)
  * [.execPwon(cb)](#OPC+execPwon)
  * [.getConnectmode(cb)](#OPC+getConnectmode)
  * [.switchCameramode(param, cb)](#OPC+switchCameramode)
  * [.getCommpath(cb)](#OPC+getCommpath)
  * [.switchCommpath(param, cb)](#OPC+switchCommpath)
  * [.execPwoff(cb)](#OPC+execPwoff)
  * [.startPushevent(param, cb)](#OPC+startPushevent)
  * [.stopPushevent(cb)](#OPC+stopPushevent)
  * [.getState(cb)](#OPC+getState)
  * [.getCamprop(param, cb)](#OPC+getCamprop)
  * [.setCamprop(param, cb)](#OPC+setCamprop)
  * [.getResizeimg(param, cb)](#OPC+getResizeimg)
  * [.getImglist(param, cb)](#OPC+getImglist)
  * [.getScreennail(param, cb)](#OPC+getScreennail)
  * [.getMovfileinfo(param, cb)](#OPC+getMovfileinfo)
  * [.getImageinfo(param, cb)](#OPC+getImageinfo)
  * [.getThumbnail(param, cb)](#OPC+getThumbnail)
  * [.execStoreimage(cb)](#OPC+execStoreimage)
  * [.execTakemotion(param, cb)](#OPC+execTakemotion)
  * [.execTakemisc(param, cb)](#OPC+execTakemisc)
  * [.execErase(param, cb)](#OPC+execErase)
  * [.releaseAllprotect(cb)](#OPC+releaseAllprotect)
  * [.execProtect(param, cb)](#OPC+execProtect)
  * [.negotiate(param, cbFunction)](#OPC+negotiate)
  * [.destroy()](#OPC+destroy)

<a name="new_OPC_new"></a>
### new OPC()
OPC

<a name="OPC+execPwon"></a>
### opc.execPwon(cb)
電源ON

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+getConnectmode"></a>
### opc.getConnectmode(cb)
接続モード取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+switchCameramode"></a>
### opc.switchCameramode(param, cb)
動作モード切り替え

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+getCommpath"></a>
### opc.getCommpath(cb)
コマンド受付元取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+switchCommpath"></a>
### opc.switchCommpath(param, cb)
コマンド受付元切り替え

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+execPwoff"></a>
### opc.execPwoff(cb)
電源OFF

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+startPushevent"></a>
### opc.startPushevent(param, cb)
イベント通知開始

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+stopPushevent"></a>
### opc.stopPushevent(cb)
イベント通知終了

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+getState"></a>
### opc.getState(cb)
カメラ状態取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+getCamprop"></a>
### opc.getCamprop(param, cb)
カメラプロパティ取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+setCamprop"></a>
### opc.setCamprop(param, cb)
カメラプロパティ設定

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+getResizeimg"></a>
### opc.getResizeimg(param, cb)
リサイズ画像取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+getImglist"></a>
### opc.getImglist(param, cb)
画像リスト取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+getScreennail"></a>
### opc.getScreennail(param, cb)
デバイス用再生画像取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+getMovfileinfo"></a>
### opc.getMovfileinfo(param, cb)
動画ファイル情報取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+getImageinfo"></a>
### opc.getImageinfo(param, cb)
静止画ファイル情報取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+getThumbnail"></a>
### opc.getThumbnail(param, cb)
サムネイル画像取得

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+execStoreimage"></a>
### opc.execStoreimage(cb)
記録画像転送

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+execTakemotion"></a>
### opc.execTakemotion(param, cb)
撮影制御

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+execTakemisc"></a>
### opc.execTakemisc(param, cb)
撮影補助

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+execErase"></a>
### opc.execErase(param, cb)
1コマ消去

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+releaseAllprotect"></a>
### opc.releaseAllprotect(cb)
全コマプロテクト解除

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| cb | <code>function</code> | 

<a name="OPC+execProtect"></a>
### opc.execProtect(param, cb)
1コマプロテクト設定・解除

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="OPC+negotiate"></a>
### opc.negotiate(param, cbFunction)
撮影準備のためのネゴシエーション

**Kind**: instance method of <code>[OPC](#OPC)</code>  

| Param | Type |
| --- | --- |
| param | <code>Object</code> | 
| cbFunction | <code>function</code> | 

<a name="OPC+destroy"></a>
### opc.destroy()
接続解除

**Kind**: instance method of <code>[OPC](#OPC)</code>  
