import * as debug from 'debug';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

const debugLog = debug('scaffolding');

const copyRecursiveSync = (src: string, dest: string, options: any) => {
  const exists = fs.existsSync(src);
  const isDirectory = exists ? fs.statSync(src).isDirectory() : false;
  if (exists && isDirectory) {
    debugLog('creating directory', dest);
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName: any) => {
      debugLog('copying from', src, 'into', dest, 'File:', childItemName);
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        options,
      );
    });
  } else {
    let output = fs.readFileSync(src).toString();
    if (options.engine === 'ejs') {
      output = ejs.render(output, options.data);
    }
    fs.writeFileSync(dest, output);
  }
};

/**
 * Folder scaffolding
 * @param  {string}   templateSourceFolder Templating source
 * @param  {string}   destinationFolder    Destination folder
 * @param  {object}   options (optional)
 *                    options.engine : templating engine ('ejs')
 *                    options.replace : object with replacement options
 * @param  {Function} cb                   Callback (err, null);
 */
export function scaffold(
  templateSourceFolder: string,
  destinationFolder: string,
  options: any,
  cb: any,
) {
  mkdirp(path.dirname(destinationFolder), (err: any) => {
    if (err) {
      return cb(err);
    }

    copyRecursiveSync(templateSourceFolder, destinationFolder, options);
    cb();
  });
}
