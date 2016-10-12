/*:en
 * @plugindesc
 * Make flashes in animations rapid blinks.
 * 
 * @help
 * You can disable this plugin on the game to run the script:
 *   Lufar.RetroFlash.enable = false;
 *//* For know about rapid blinks, google "Pokémon Shock."
 */
/*:ja
 * @plugindesc
 * アニメーションの対象物フラッシュを昔懐かしパカパカにし、
 * 画面のフラッシュを色に応じて加算ないし乗算合成にします。
 * 
 * @author ルファー (Twitter @tkooler_lufar)
 * 
 * @help
 * Lufar.RetroFlash.enable = false; で無効化できるようにしてあります。
 * 
 * アニメーション対象物のフラッシュは常にパカパカですが、
 * 画面のフラッシュは色が暗いときだけパカパカになります。
 * 色が明るい場合、フラッシュは加算合成になります(通常合成より処理が軽そうだから)。
 * 
 * パカパカが視聴者に及ぼしうる影響については「パカパカ アニメーション」または「ポケモンショック」でググってください。
 * 念のため Lufar.RetroFlash.enable = false; で無効化できるようにしてあります。
 */

// namespace
Lufar = Lufar || {};
Lufar['RetroFlash'] = Lufar['RetroFlash'] || {};

(function() {
    this.enable = true;

    var proto_updateFlash = Sprite_Animation.prototype.updateFlash;
    Sprite_Animation.prototype.updateFlash = function() {
        if(!Lufar.RetroFlash.enable) {
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

    var proto_updateScreenFlash = Sprite_Animation.prototype.updateScreenFlash;
    Sprite_Animation.prototype.updateScreenFlash = function() {
        if (!Lufar.RetroFlash.enable) {
            return proto_updateScreenFlash.call(this);
        }
        var d = this._screenFlashDuration--;
        if (d > 0) {
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                if (this._screenFlashSprite.blendMode == PIXI.blendModes.NORMAL) {
                    this._screenFlashSprite.visible = !!(d & 2);
                } else {
                    this._screenFlashSprite.opacity *= (d - 1) / d;
                }
            }
        }
    };

    var proto_startScreenFlash = Sprite_Animation.prototype.startScreenFlash;
    Sprite_Animation.prototype.startScreenFlash = function(color, duration) {
        var ret = proto_startScreenFlash.call(this, color, duration);
        if(!Lufar.RetroFlash.enable) {
            return ret;
        }
        if (this._screenFlashSprite) {
            if ((
                Math.max(color[0], color[1], color[2]) + Math.min(color[0], color[1], color[2])
            ) >= 255) {
                this._screenFlashSprite.blendMode = PIXI.blendModes.ADD;
            }
            else {
                this._screenFlashSprite.blendMode = PIXI.blendModes.NORMAL;
            }
        }
    };
    /*
    Sprite_Animation.prototype.updateFlash = function() {
        if (this._flashDuration > 0) {
            var d = this._flashDuration--;
            this._target.setBlendColor(this._flashDuration & 2 ? this._flashColor : [0, 0, 0, 0]);
        }
    };

    Sprite_Animation.prototype.updateScreenFlash = function() {
        if (this._screenFlashDuration > 0) {
            var d = this._screenFlashDuration--;
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                this._screenFlashSprite.visible = (this._screenFlashDuration > 0) && (this._screenFlashDuration & 2);
            }
        }
    };
    //*/
}).call(Lufar['RetroFlash']);