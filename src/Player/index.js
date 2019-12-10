import React from "react";
import PropTypes from "prop-types";
import Hls from "hls.js";

const HLS_LOCATION = process.env.REACT_APP_HLS_LOCATION;

class Player extends React.PureComponent {
  constructor(props) {
    super(props);

    this._onMediaAttached = this._onMediaAttached.bind(this);
    this._onManifestParsed = this._onManifestParsed.bind(this);
    this._onError = this._onError.bind(this);

    this._audioRef = React.createRef();
    this._hls = new Hls();
  }

  componentDidMount() {
    this._hls.attachMedia(this._audioRef.current);
    this._hls.on(Hls.Events.MEDIA_ATTACHED, this._onMediaAttached);
  }

  componentDidUpdate(prevProps) {
    const { prevPlay } = prevProps;
    const play = this.props;
    if (prevPlay !== play) {
      if (play) {
        this._audioRef.current.play();
      } else {
        this._audioRef.current.pause();
      }
    }
  }

  _onMediaAttached() {
    this._hls.loadSource(HLS_LOCATION);
    this._hls.on(Hls.Events.MANIFEST_PARSED, this._onManifestParsed);
    this._hls.on(Hls.Events.ERROR, this._onError);
  }

  _onManifestParsed() {
    const { onPlayerReady } = this.props;

    onPlayerReady && onPlayerReady();
  }

  _onError(_, data) {
    if (data.type === "networkError") {
      setTimeout(() => this._hls.loadSource(HLS_LOCATION), 2000);
    }
  }

  render() {
    return <audio ref={this._audioRef}></audio>;
  }
}

Player.propTypes = {
  onPlayerReady: PropTypes.func,
  play: PropTypes.bool
};

export default Player;