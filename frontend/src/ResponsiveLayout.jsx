/*
 Not my code!
 Found in Professor David Harrison's RWDReactHooks example
*/
import {useDimensions} from './DimensionsProvider';
const ResponsiveLayout = ({breakPoint = 900, renderNarrow, renderDefault}) => {
  const {width} = useDimensions();
  return width > breakPoint ? renderDefault() : renderNarrow();
};

export default ResponsiveLayout;
