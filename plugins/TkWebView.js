/*:ja
 * @plugindesc ゲーム上に Web ページを重ね合わせます。
 * @author ルファー
 *
 * @param Style
 * @default
 * @desc iframe に適用するスタイル。 (既定値: 空欄)
 * CSS に精通してる方向けのオプションです。
 *
 * @help
 * まだ書いてないよ
 */

/**
 * 公開オブジェクトの名前空間 (第三者が拡張する用)
 * Lufar.TkWebView に入れます。
 */
if(typeof(Lufar) === 'undefined') Lufar = {};
Lufar.TkWebView = {};

/////// Lufar 名前空間
(function() {
  /**
   * 各 DOM オブジェクトの親となる DOM 要素の ID (第三者が改造する用)
   */
  this.containerId = 'Lufar_Container';

  /**
   * container の描画順位
   */
  this.containerZIndex = 4;

  /**
   * プラグインコマンドの登録
   * @param cmd String 対応するコマンド
   * @param func Function コマンドを処理する関数
   */
  this.addPluginCommand = function(cmd, func) {
    var super_ = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
      super_.call(this, command, args);
      if(command === cmd) {
        func(args);
      }
    };
  }

  /**
   * DOM 要素配置用ブロックの取得 (なければ作成)
   */
  this.getContainerDOM = function() {
    var div = document.getElementById(this.containerId);
    if(!div) {
      div = document.createElement('div');
      div.id = this.containerId;
      // スタイルもろもろ設定
      div.style.position = 'absolute';
      div.style.margin = 'auto';
      div.style.top = '0';
      div.style.left = '0';
      div.style.right = '0';
      div.style.bottom = '0';
      div.style.zIndex = this.containerZIndex;
    }
    // 画面サイズは可変なので毎回更新する
    div.style.width = Graphics.width + 'px';
    div.style.height = Graphics.height + 'px';
    document.body.appendChild(div);
    return div;
  }

  /*
   * div を消す
   */
  this.removeContainerDOM = function() {
    var div = document.getElementById(this.containerId);
    if(div) {
      div.parentNode.removeChild(div);
    }
  }
}).call(Lufar);

/////// Lufar.TkWebView 名前空間
(function() {
  /**
   * WebView の DOM 上 ID (第三者が改造する用)
   */
  this.iframeId = 'TkWebView';

  /**
   * iframe 取得 (なければ作成)
   */
  this.getWebViewDOM = function() {
    var container = Lufar.getContainerDOM();
    var iframe = document.getElementById(this.iframeId);
    if(!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = this.iframeId;
      // スタイルもろもろ設定
      var parameters = PluginManager.parameters('TkWebView');
      iframe.style.cssText = parameters['Style'];
      iframe.style.position = 'absolute';
      if(iframe.style.border === '') {
        iframe.style.border = 'none';
      }
    }
    container.appendChild(iframe);
    return iframe;
  }

  /*
   * iframe を消す
   */
  this.removeWebViewDOM = function() {
    var iframe = document.getElementById(Lufar.TkWebView.iframeId);
    if(iframe) {
      iframe.parentNode.removeChild(iframe);
    }
  }

  /**
   * WebView を表示する
   * @param location String 表示したい Web ページの URL
   * @param x Number WebView 左上すみの x 座標
   * @param y Number WebView 左上すみの y 座標
   * @param width Number WebView の幅
   * @param height Number WebView の高さ
   */
  this.showWebView = function(location, x, y, width, height) {
    var iframe = this.getWebViewDOM();
    iframe.src = location;
    iframe.style.left = x + 'px';
    iframe.style.top = y + 'px';
    iframe.style.width = width + 'px';
    iframe.style.height = height + 'px';
  };

  Lufar.addPluginCommand('TkWebView', function(args) {
    if(args[0] === 'open') {
      var x        = args[1];
      var y        = args[2];
      var width    = args[3];
      var height   = args[4];
      var location = args[5];
      Lufar.TkWebView.showWebView(location, x, y, width, height);
    }
    if(args[0] === 'close') {
      Lufar.TkWebView.removeWebViewDOM();
    }
  });
}).call(Lufar.TkWebView);