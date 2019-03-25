/**
 * 验证是否为http or https 请求
 * @param path
 * @returns {boolean}
 */
export const isHttpUrl = (path) => {
  return path.substr(0, 7) === 'http://' || path.substr(0, 8) === 'https://'
}

/**
 * 路径是否存在查找对象中的路径
 * @param path
 * @param map
 * @returns {*}
 */
export const pathIsHas = (path, map = {}) => {
  if (map.hasOwnProperty(path)) {
    return path
  }

  let new_path = path.split('?').shift()
  if (map.hasOwnProperty(new_path)) {
    return new_path
  }

  while (new_path.lastIndexOf('/') > 0) {
    new_path = new_path.substr(0, new_path.lastIndexOf('/'))
    if (map.hasOwnProperty(new_path)) {
      return new_path
    }
  }

  return new_path
}

/**
 * 根据路径查找对象
 * @param pathname 路径信息
 * @param map 查找的对象
 * @returns {*}
 */
export const findPathInfoByPathName = (pathname, map = {}) => {
  if (!pathname) {
    return null
  }

  if (map.hasOwnProperty(pathname)) {
    return map[pathname]
  }

  let new_path = pathname.split('?').shift()
  if (map.hasOwnProperty(new_path)) {
    return map[new_path]
  }

  while (new_path.lastIndexOf('/') > 0) {
    new_path = new_path.substr(0, new_path.lastIndexOf('/'))
    if (map.hasOwnProperty(new_path)) {
      return map[new_path]
    }
  }

  return null
}
