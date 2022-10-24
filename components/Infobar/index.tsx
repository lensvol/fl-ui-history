import React from "react";
import { connect } from "react-redux";

import Snippet from "components/Snippet";
import MediaXlUp from "components/Responsive/MediaXlUp";

import Advert from "components/Infobar/Advert";
import Welcome from "components/Infobar/Welcome";
import { IAppState } from "types/app";

class Infobar extends React.Component<Props> {
  static displayName = "Infobar";

  renderAdvert = () => {
    const { advert } = this.props;
    if (!(advert?.altText && advert?.url && advert?.image)) {
      return null;
    }
    return <Advert {...advert} />;
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
              <Snippet />
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
  },
  infoBar: { advert, snippets },
  map: { currentArea },
}: IAppState) => ({
  advert,
  currentArea,
  snippets,
  name,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Infobar);
