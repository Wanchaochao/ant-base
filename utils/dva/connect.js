import { connect as dvaConnect } from 'dva';
import { errHandle } from '../err';
import co from 'co';

// {type , payload} or (type , payload) 统一转换为 {type , payload}
export const args2RedusAction = (...arg) => {
  if (typeof arg[0] === 'object') {
    return arg[0];
  }

  if (arg.length > 1) {
    return {
      type: arg[0],
      payload: arg[1],
    };
  }

  return {
    type: arg[0],
    payload: {},
  };
};

// 全局dispatch {type , payload} or (type , payload)
export const dispatch = (...args) => {
  return window.g_app._store.dispatch(args2RedusAction(...args));
};

// 支持 dispatch(type , payload)
export const connect = (...args) => (Comp) => {
  return dvaConnect(...args)(props => {
    let { dispatch, ...other } = props;
    const dispatchHoc = (...dispatchArgs) => dispatch(args2RedusAction(...dispatchArgs));

    return (
      <Comp {...other} dispatch={dispatchHoc}/>
    );
  });
};
