import { videoFeatures } from '@videojs/core/dom';

import { createPlayer } from '../../player/create-player';
import { ContainerElement } from '../../ui/container/container-element';
import { UIElement } from '../../ui/ui-element';
import { safeDefine } from '../safe-define';

const { ProviderMixin } = createPlayer({
  features: videoFeatures,
});

/**
 * Player-state provider registered as `<video-player>`.
 *
 * The element owns the configured video store but no layout. Put a skin or `<media-container>` inside it to provide the
 * media, controls, and fullscreen target.
 */
export class VideoPlayerElement extends ProviderMixin(UIElement) {
  static readonly tagName = 'video-player';
}

// Provider must be defined before consumer for context handshake during upgrade.
safeDefine(VideoPlayerElement);
safeDefine(ContainerElement);

declare global {
  interface HTMLElementTagNameMap {
    [VideoPlayerElement.tagName]: VideoPlayerElement;
  }
}
