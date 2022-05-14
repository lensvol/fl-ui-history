import React from 'react';
import PropTypes from 'prop-types';

import GenderOption from './GenderOption';

export default function GenderOptions(props) {
  const {
    gender,
    onChange,
  } = props;
  return (
    <div className="col-1-of-2">
      <p className="lede">May we ask whether you're a lady or a gentleman?</p>
      <GenderOption id="lady" value="Lady" gender={gender} onChange={onChange}>
        A lady
      </GenderOption>
      <GenderOption id="gentleman" value="Gentleman" gender={gender} onChange={onChange}>
        A gentleman
      </GenderOption>
      <GenderOption id="indistinct" value="Indistinct" gender={gender} onChange={onChange}>
        My dear sir, there are individuals roaming the streets of
        {' '}
        Fallen London at this very moment with the faces of squid!
        {' '}
        Squid! Do you ask them their gender? And yet you waste our time asking me
        {' '}
        trifling and impertinent questions about mine?
        {' '}
        It is my own business, sir, and I bid you good day.
      </GenderOption>
    </div>
  );
}

GenderOptions.displayName = 'GenderOptions';

GenderOptions.propTypes = {
  gender: PropTypes.oneOf(['Gentleman', 'Lady', 'Indistinct']),
  onChange: PropTypes.func.isRequired,
};

GenderOptions.defaultProps = {
  gender: undefined,
};