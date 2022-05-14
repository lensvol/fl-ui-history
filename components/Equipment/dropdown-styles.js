import { MESSAGE_LAPSED_EXCEPTIONAL_OUTFIT } from 'constants/outfits';

// eslint-disable-next-line no-shadow
export function theme(theme) {
  return ({
    ...theme,
    borderRadius: 0,
    spacing: {
      ...theme.spacing,
      menuGutter: 0,
    },
    colors: {
      ...theme.colors,

      neutral0: '#756b5a', // OK
      neutral5: '#ede3d2', // OK
      neutral10: '#ede3d2',
      neutral20: '#ede3d2',
      neutral30: '#ede3d2', // ??
      neutral40: '#ede3d2', // ??
      neutral50: '#ede3d2', // ??
      neutral60: '#ede3d2', // ??
      neutral70: '#ede3d2', // ??
      neutral80: '#ede3d2', // currently selected outfit

      primary: '#ede3d2',
      primary25: '#282520',
    },
  });
}

export const styles = {
  container: provided => ({
    ...provided,
    borderColor: '#756b5a',
    color: '#ede3d2',
    flex: 1,
    fontSize: '16px',
    height: '40px',
    maxWidth: '16rem',
    marginRight: '8px',
  }),
  control: (provided, state) => ({
    ...provided,
    ...(state.isDisabled ? { backgroundColor: 'transparent' } : {}),
    borderColor: '#756b5a',
    ':active': {
      borderColor: '#7ebcc0',
      outline: 0,
      boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(126, 188, 192, 0.6)',
    },
    ':focus': {
      borderColor: '#7ebcc0',
      outline: 0,
      boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(126, 188, 192, 0.6)',
    },
    ':hover': {
      borderColor: '#756b5a',
      boxShadow: 'none',
    },
  }),
  menu: provided => ({
    ...provided,
    fontSize: '16px',
    fontWeight: 300,
  }),
  menuList: provided => ({
    ...provided,
    maxHeight: 450,
  }),
  option: (provided, state) => {
    const { data } = state;

    const separatorStyles = data.needsSeparator ? {
      borderTop: 'solid 1px #00000040',
    } : {};

    if (data.type === 'Exceptional') {
      // const color = data.isDisabled ? '#fc4c00' : '#fcac00';
      const backgroundColor = data.isDisabled ? '#555' : provided.backgroundColor;
      const color = '#fcac00';
      const content = data.isDisabled ? MESSAGE_LAPSED_EXCEPTIONAL_OUTFIT : 'Exceptional';
      return {
        ...provided,
        ...separatorStyles,
        backgroundColor,
        color,
        ':after': {
          content: `"${content}"`,
          display: 'block',
          fontStyle: 'italic',
          fontSize: '10px',
          position: 'relative',
          right: 0,
        },
      };
    }

    if (data.type === 'BuyOutfit') {
      return {
        ...provided,
        ...separatorStyles,
        color: '#fcac00',
        ':hover': {
          backgroundColor: '#ba7f00',
          color: 'white',
        },
      };
    }

    return {
      ...provided,
      ...separatorStyles,
    };
  },
};
