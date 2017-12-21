import * as debug from 'debug';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

const debugLog = debug('scaffolding');

/**
 * Folder scaffolding
 * @param  {string}   templateSourceFolder Templating source
 * @param  {string}   destinationFolder    Destination folder
 * @param  {object}   options (optional)
 *                    options.engine : templating engine ('ejs')
 *                    options.replace : object with replacement options
 * @param  {Function} cb                   Callback (err, null);
 */
export function scaffold(templateSourceFolder: any, destinationFolder: any, options: any, cb: any) {
  function applyReplacements(fileName: any, replacements: any) {
    let processedFileName;
    // tslint:disable-next-line forin
    for (const item in replacements) {
      const replace = replacements[item];
      if (fileName.indexOf(item) > -1) {
        processedFileName = fileName.replace(item, replace);
        break;
      } else {
        processedFileName = fileName;
      }
    }
    return processedFileName;
  }

  // based on http://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
  const copyRecursiveSync = (src: any, dest: any) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (exists && isDirectory) {
      debugLog('creating directory', dest);
      fs.mkdirSync(dest);
      fs.readdirSync(src).forEach((childItemName: any) => {
        debugLog('copying from', src, 'into', dest, 'File:', childItemName);
        copyRecursiveSync(
          path.join(src, childItemName),
          path.join(dest, childItemName),
        );
      });
    } else {
      const destinationFile = applyReplacements(dest, options.replace || {});
      let output = fs.readFileSync(src).toString();
      if (options.engine === 'ejs') {
        output = ejs.render(output, options.data);
      }
      fs.writeFileSync(destinationFile, output);
    }
  };

  mkdirp(path.dirname(destinationFolder), (err: any) => {
    if (err) {
      return cb(err);
    }

    copyRecursiveSync(templateSourceFolder, destinationFolder);
    cb();
  });
}
