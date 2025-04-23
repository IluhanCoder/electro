export default function bindAll(obj: any): void {
    const proto = Object.getPrototypeOf(obj);
    Object.getOwnPropertyNames(proto)
      .filter(key => typeof obj[key] === 'function' && key !== 'constructor')
      .forEach(key => {
        obj[key] = obj[key].bind(obj);
      });
  }