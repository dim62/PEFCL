export const CONNECTION_STRING = 'mysql_connection_string';
const regex = new RegExp(
  '^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?$',
);

export const parseUri = (connectionUri: string) => {
  const splitMatchGroups = connectionUri.match(regex);

  if (!splitMatchGroups) {
    throw new Error('Invalid connection string');
  }

  // Handle parsing for optional password auth
  const authTgt = splitMatchGroups[2] ? splitMatchGroups[2].split(':') : [];

  const removeForwardSlash = (str: string) => str.replace(/^\/+/, '');

  if (connectionUri.includes('mysql://'))
    return {
      driver: splitMatchGroups[1],
      user: authTgt[0] || undefined,
      password: authTgt[1] || undefined,
      host: splitMatchGroups[3],
      port: parseInt(splitMatchGroups[4], 10),
      database: removeForwardSlash(splitMatchGroups[5]),
      params: splitMatchGroups[6],
    };

  return connectionUri
    .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
    .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
    .replace(/(?:pwd|pass)=/gi, 'password=')
    .replace(/(?:db)=/gi, 'database=')
    .split(';')
    .reduce<Record<string, string>>((connectionInfo, parameter) => {
      const [key, value] = parameter.split('=');
      connectionInfo[key] = value;
      return connectionInfo;
    }, {});
};

export const getSslParam = (paramsStr: string) => {
  if (!paramsStr?.length) {
    return;
  }

  const params = new URLSearchParams(paramsStr);
  const ssl = params.get('ssl');
  if (!ssl) {
    return;
  }

  return JSON.parse(ssl);
};
