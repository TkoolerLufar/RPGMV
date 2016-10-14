/*:en
 * @plugindesc
 * Make flashes in animations rapid blinks.
 * 
 * @param OptionLabel
 * @default Another flash in battle
 * @desc The label of configuration in the option list.
 * If it's set empty, it doesn't appear in the option list.
 * 
 * @param OptionDefault
 * @default 1
 * @desc Default mode. Set 0 to disable in default.
 * 
 * @help
 * * Plugin Commands
 * 
 * RetroFlash enable
 * : Enable this plugin.
 *   It overrides the setting in the option.
 * 
 * RetroFlash disable
 * : Disable this plugin.
 *   It overrides the setting in the option.
 * 
 * RetroFlash reset
 * : Reset the setting.
 *   Then the setting in the option was refered.
 * 
 * * Caution
 * 
 * For know about rapid blinks, google "Pokémon Shock."
 */
/*:ja
 * @plugindesc
 * 戦闘アニメーションのフラッシュを昔懐かしパカパカにします。
 * 処理が軽くなりますが目に強い刺激を与える場合があります。
 * 
 * @author ついったtkooler_lufar
 * 
 * @param OptionLabel
 * @default 戦闘時フラッシュ軽量化
 * @desc オプションでパカパカの ON/OFF をする項目の名前。
 * 空にするとオプションで設定できなくなります。
 * 
 * @param OptionDefault
 * @default 1
 * @desc パカパカを既定で有効にするかどうか。
 * 0 にすると既定で無効になります。
 * 
 * @help
 * * プラグインコマンド
 * 
 * RetroFlash enable
 * : パカパカを有効化します。
 *   オプションの設定より優先されます。
 * 
 * RetroFlash disable
 * : パカパカを無効化します。
 *   オプションの設定より優先されます。
 * 
 * RetroFlash reset
 * : パカパカの設定を元に戻します。
 *   再び enable/disable するまでオプションの設定に従います。
 * 
 * 
 * * 備考
 * 
 * パカパカが視聴者に及ぼしうる影響については
 * 「パカパカ アニメーション」または「ポケモンショック」でググってください。
 */

// namespace
Lufar = Lufar || {};
Lufar['RetroFlash'] = Lufar['RetroFlash'] || {};

(function() {
    /**
     * おぷしょん JSON に入れるフラグの識別子
     */
    this.CONFIG_ID = 'Lufar_RetroFlash_enable';

    /**
     * パカパカが有効かどうか
     * プラグインコマンドの設定が生きてればそれを参照し、
     * 層でなければコンフィグを参照します。
     */
    Object.defineProperty(this, 'enabled', {
        'get': function() {
            var systemVlaue = this.systemEnabled;
            if (systemVlaue) {
                return systemVlaue > 0;
            }
            return this.configEnabled;
        }
    });

    /**
     * コンフィグの設定。保存されてなければデフォルトを参照します。
     */
    Object.defineProperty(this, 'configEnabled', {
        'get': function() {
            if (ConfigManager) {
                return ConfigManager[this.CONFIG_ID];
            }
            return null;
        },
        'set': function(value) {
            if(!ConfigManager) {
                return !!value;
            }
            return ConfigManager[this.CONFIG_ID] == !!value;
        }
    });

    /**
     * プラグインコマンドの設定が有効かどうか
     * 正の数⇒有効
     * 負の数⇒無効
     * 0⇒未設定
     */
    Object.defineProperty(this, 'systemEnabled', {
        'get': function() {
            if (
                $gameSystem &&
                $gameSystem['Lufar_RetroFlash']
            ) {
                return $gameSystem['Lufar_RetroFlash']['enabled'];
            }
            return 0;
        },
        'set': function(value) {
            if (!$gameSystem) {
                return !!value;
            }
            if(!$gameSystem['Lufar_RetroFlash']) {
                $gameSystem['Lufar_RetroFlash'] = {};
            }
            return $gameSystem['Lufar_RetroFlash']['enabled'] = value;
        }
    });

    /**
     * 対象物フラッシュの更新
     */
    var proto_updateFlash = Sprite_Animation.prototype.updateFlash;
    Sprite_Animation.prototype.updateFlash = function() {
        if(!Lufar.RetroFlash.enabled) {
            return proto_updateFlash.call(this);
        }
        var d = this._flashDuration--;
        if (d > 0) {
            var flashColor = this._flashColor.concat();
            if (~d & 2) {
                flashColor[3] = 0;
            }
            this._target.setBlendColor(flashColor);
        }
    };

    /**
     * 画面フラッシュの更新
     */
    var proto_updateScreenFlash = Sprite_Animation.prototype.updateScreenFlash;
    Sprite_Animation.prototype.updateScreenFlash = function() {
        if (!Lufar.RetroFlash.enabled) {
            return proto_updateScreenFlash.call(this);
        }
        var d = this._screenFlashDuration--;
        if (d > 0) {
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                if (this._screenFlashSprite.blendMode == Graphics.BLEND_NORMAL) {
                    // 位相を対象物フラッシュとずらし、対象物フラッシュと丸かぶりしないように
                    this._screenFlashSprite.visible = !!(d & 2) ^ !(d & 1);
                } else {
                    this._screenFlashSprite.opacity *= (d - 1) / d;
                }
            }
        }
        else {
            // フラッシュ終了時の後始末
            this._screenFlashSprite.blendMode = Graphics.BLEND_NORMAL;
        }
    };

    /**
     * 画面フラッシュの開始
     */
    var proto_startScreenFlash = Sprite_Animation.prototype.startScreenFlash;
    Sprite_Animation.prototype.startScreenFlash = function(color, duration) {
        var ret = proto_startScreenFlash.call(this, color, duration);
        if (Lufar.RetroFlash.enabled) {
            if (this._screenFlashSprite) {
                if ((
                    Math.max(color[0], color[1], color[2]) + Math.min(color[0], color[1], color[2])
                ) >= 255) {
                    this._screenFlashSprite.blendMode = Graphics.BLEND_ADD;
                }
                else {
                    // this._screenFlashSprite.setColor(255,255,255);
                    this._screenFlashSprite.blendMode = Graphics.BLEND_MULTIPLY;
                }
                // 画面フラッシュが加乗算合成できない問題が解決するまでパカパカ
                this._screenFlashSprite.blendMode = Graphics.BLEND_NORMAL;
            }
        }
        return ret;
    };

    /**
     * プラグインコマンド
     */
    var proto_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if(command === 'RetroFlash') {
            switch(args[0]) {
            case 'enable':
                Lufar.RetroFlash.systemEnabled = +1;
                break;
            case 'disable':
                Lufar.RetroFlash.systemEnabled = -1;
                break;
            case 'reset':
                Lufar.RetroFlash.systemEnabled = 0;
                break;
            }
        }
        return proto_pluginCommand.call(this, command, args);
    }

    /**
     * コンフィグデータの作成
     */
    var proto_makeConfigData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = proto_makeConfigData.call(this);
        config[Lufar.RetroFlash.CONFIG_ID] = this[Lufar.RetroFlash.CONFIG_ID];
        return config;
    }

    /**
     * コンフィグデータの適用
     */
    var proto_applyConfigData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        proto_applyConfigData.call(this, config);
        if (config[Lufar.RetroFlash.CONFIG_ID] !== undefined) {
            this[Lufar.RetroFlash.CONFIG_ID] = this.readFlag(config, Lufar.RetroFlash.CONFIG_ID);
        }
        else {
            this[Lufar.RetroFlash.CONFIG_ID] = Lufar.RetroFlash.defaultEnabled;
        }
    }

    /**
     * コンフィグ項目の作成
     */
    var proto_makeOptionCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        proto_makeOptionCommandList.call(this);
        var enableLabel = PluginManager.parameters('RetroFlash')['OptionLabel'];
        if (enableLabel != '') {
            this.addCommand(enableLabel, Lufar.RetroFlash.CONFIG_ID);
        }
    }
}).call(Lufar['RetroFlash']);