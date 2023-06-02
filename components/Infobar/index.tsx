import React from "react";
import { connect } from "react-redux";

import Snippet from "components/Snippet";
import MediaXlUp from "components/Responsive/MediaXlUp";

import Advert from "components/Infobar/Advert";
import Welcome from "components/Infobar/Welcome";
import { IAppState } from "types/app";
import { UIRestriction } from "types/myself";

class Infobar extends React.Component<Props> {
  static displayName = "Infobar";

  renderAdvert = () => {
    const { advert, showExtrasUI } = this.props;

    if (advert?.altText && advert?.url && advert?.image && showExtrasUI) {
      return <Advert {...advert} />;
    }

    return null;
  };

  renderWelcome = () => {
    const { currentArea, name } = this.props;
    if (!name || !currentArea?.name) {
      return null;
    }
    return <Welcome name={name} currentAreaName={currentArea.name} />;
  };

  /**
   * render
   * @return {Object}
   */
  render() {
    return (
      <MediaXlUp>
        <div className="col-tertiary">
          <div className="col-1-of-3">
            <div className="travel">
              {this.renderWelcome()}
              <br />
              <br />
              {this.renderAdvert()}
              {this.props.showExtrasUI && <Snippet />}
            </div>
          </div>
        </div>
      </MediaXlUp>
    );
  }
}

const mapStateToProps = ({
  myself: {
    character: { name },
    uiRestrictions,
  },
  infoBar: { advert, snippets },
  map: { currentArea },
}: IAppState) => ({
  advert,
  currentArea,
  snippets,
  name,
  showExtrasUI: !uiRestrictions?.find(
    (restriction) => restriction === UIRestriction.Extras
  ),
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Infobar);
