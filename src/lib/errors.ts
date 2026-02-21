export class SynoError extends Error {
  code: number;
  errors?: unknown[];

  constructor(message: string, code: number, errors?: unknown[]) {
    super(message);
    this.name = 'SynoError';
    this.code = code;
    this.errors = errors;
  }
}

export function resolveBaseError(code: number): string {
  switch (code) {
    case 101: return 'No parameter of API, method or version';
    case 102: return 'The requested API does not exist';
    case 103: return 'The requested method does not exist';
    case 104: return 'The requested version does not support the functionality';
    case 105: return 'The logged in session does not have permission';
    case 106: return 'Session timeout';
    case 107: return 'Session interrupted by duplicate login';
    default: return 'Unknown error';
  }
}

export function resolveAuthError(code: number): string {
  switch (code) {
    case 400: return 'No such account or incorrect password';
    case 401: return 'Account disabled';
    case 402: return 'Permission denied';
    case 403: return '2-step verification code required';
    case 404: return 'Failed to authenticate 2-step verification code';
    default: return resolveBaseError(code);
  }
}

export function resolveFileStationError(code: number, api: string): string {
  if (api === 'SYNO.FileStation.Favorite') {
    switch (code) {
      case 800: return 'A folder path of favorite folder is already added to user\'s favorites.';
      case 801: return 'A name of favorite folder conflicts with an existing folder path in the user\'s favorites.';
      case 802: return 'There are too many favorites to be added.';
    }
  }
  if (api === 'SYNO.FileStation.Upload') {
    switch (code) {
      case 1800: return 'There is no Content-Length information in the HTTP header or the received size doesn\'t match the value of Content-Length information in the HTTP header.';
      case 1801: return 'Wait too long, no date can be received from client (Default maximum wait time is 3600 seconds).';
      case 1802: return 'No filename information in the last part of file content.';
      case 1803: return 'Upload connection is cancelled.';
      case 1804: return 'Failed to upload too big file to FAT file system.';
      case 1805: return 'Can\'t overwrite or skip the existed file, if no overwrite parameter is given.';
    }
  }
  if (api === 'SYNO.FileStation.Sharing') {
    switch (code) {
      case 2000: return 'Sharing link does not exist.';
      case 2001: return 'Cannot generate sharing link because too many sharing links exist.';
      case 2002: return 'Failed to access sharing links.';
    }
  }
  if (api === 'SYNO.FileStation.CreateFolder') {
    switch (code) {
      case 1100: return 'Failed to create a folder. More information in <errors> object.';
      case 1101: return 'The number of folders to the parent folder would exceed the system limitation.';
    }
  }
  if (api === 'SYNO.FileStation.Rename') {
    switch (code) {
      case 1200: return 'Failed to rename it. More information in <errors> object.';
    }
  }
  if (api === 'SYNO.FileStation.CopyMove') {
    switch (code) {
      case 1000: return 'Failed to copy files/folders. More information in <errors> object.';
      case 1001: return 'Failed to move files/folders. More information in <errors> object.';
      case 1002: return 'An error occurred at the destination. More information in <errors> object.';
      case 1003: return 'Cannot overwrite or skip the existing file because no overwrite parameter is given.';
      case 1004: return 'File cannot overwrite a folder with the same name, or folder cannot overwrite a file with the same name.';
      case 1006: return 'Cannot copy/move file/folder with special characters to a FAT32 file system.';
      case 1007: return 'Cannot copy/move a file bigger than 4G to a FAT32 file system.';
    }
  }
  if (api === 'SYNO.FileStation.Delete') {
    switch (code) {
      case 900: return 'Failed to delete file(s)/folder(s). More information in <errors> object.';
    }
  }
  if (api === 'SYNO.FileStation.Extract') {
    switch (code) {
      case 1400: return 'Failed to extract files.';
      case 1401: return 'Cannot open the file as archive.';
      case 1402: return 'Failed to read archive data error';
      case 1403: return 'Wrong password.';
      case 1404: return 'Failed to get the file and dir list in an archive.';
      case 1405: return 'Failed to find the item ID in an archive file.';
    }
  }
  if (api === 'SYNO.FileStation.Compress') {
    switch (code) {
      case 1300: return 'Failed to compress files/folders.';
      case 1301: return 'Cannot create the archive because the given archive name is too long.';
    }
  }

  switch (code) {
    case 400: return 'Invalid parameter of file operation';
    case 401: return 'Unknown error of file operation';
    case 402: return 'System is too busy';
    case 403: return 'Invalid user does this file operation';
    case 404: return 'Invalid group does this file operation';
    case 405: return 'Invalid user and group does this file operation';
    case 406: return 'Can\'t get user/group information from the account server';
    case 407: return 'Operation not permitted';
    case 408: return 'No such file or directory';
    case 409: return 'Non-supported file system';
    case 410: return 'Failed to connect internet-based file system (ex: CIFS)';
    case 411: return 'Read-only file system';
    case 412: return 'Filename too long in the non-encrypted file system';
    case 413: return 'Filename too long in the encrypted file system';
    case 414: return 'File already exists';
    case 415: return 'Disk quota exceeded';
    case 416: return 'No space left on device';
    case 417: return 'Input/output error';
    case 418: return 'Illegal name or path';
    case 419: return 'Illegal file name';
    case 420: return 'Illegal file name on FAT file system';
    case 421: return 'Device or resource busy';
    case 599: return 'No such task of the file operation';
    default: return resolveBaseError(code);
  }
}

export function resolveDownloadStationError(code: number, api: string): string {
  if (api === 'SYNO.DownloadStation.Task') {
    switch (code) {
      case 400: return 'File upload failed';
      case 401: return 'Max number of tasks reached';
      case 402: return 'Destination denied';
      case 403: return 'Destination does not exist';
      case 404: return 'Invalid task id';
      case 405: return 'Invalid task action';
      case 406: return 'No default destination';
      case 407: return 'Set destination failed';
      case 408: return 'File does not exist';
    }
  }
  if (api === 'SYNO.DownloadStation.BTSearch') {
    switch (code) {
      case 400: return 'Unknown error';
      case 401: return 'Invalid parameter';
      case 402: return 'Parse the user setting failed';
      case 403: return 'Get category failed';
      case 404: return 'Get the search result from DB failed';
      case 405: return 'Get the user setting failed';
    }
  }
  return resolveBaseError(code);
}

// Fixed: CoffeeScript `if api is 'X' or 'Y'` was always truthy.
// Now uses proper `===` checks.
export function resolveSurveillanceStationError(code: number, api: string): string {
  if (api === 'SYNO.SurveillanceStation.Camera' || api === 'SYNO.SurveillanceStation.PTZ') {
    switch (code) {
      case 400: return 'Execution failed';
      case 401: return 'Parameter invalid';
      case 402: return 'Camera disabled';
    }
  }
  if (api === 'SYNO.SurveillanceStation.Event' || api === 'SYNO.SurveillanceStation.Emap') {
    switch (code) {
      case 400: return 'Execution failed';
      case 401: return 'Parameter invalid';
    }
  }
  if (api === 'SYNO.SurveillanceStation.Device') {
    switch (code) {
      case 400: return 'Execution failed';
      case 401: return 'Service is not enabled';
    }
  }
  if (api === 'SYNO.SurveillanceStation.Notification') {
    switch (code) {
      case 400: return 'Execution failed';
    }
  }
  return resolveBaseError(code);
}
