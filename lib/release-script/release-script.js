var fs = require('fs-extra');
var path = require('path');
var archiver = require('archiver');
var BuildPaths = require('../build-paths');



var srcThemesLight = fs.readdirSync(path.join('extension', 'themes/light')).filter(f => f.endsWith('.js')).map(f => f.replace('.js', ''));
var srcThemesDark = fs.readdirSync(path.join('extension', 'themes/dark')).filter(f => f.endsWith('.js')).map(f => f.replace('.js', ''));
var allThemeNames = srcThemesLight.concat(srcThemesDark);
var themesCount = allThemeNames.length + 1;


var viewerAlertPath = path.join(BuildPaths.EXTENSION, 'assets/viewer-alert.js');
if (fs.existsSync(viewerAlertPath)) {
  fs.removeSync(viewerAlertPath);
}

var assetsDir = path.join(BuildPaths.EXTENSION, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.readdirSync(assetsDir).forEach(function(filename) {
    if (allThemeNames.indexOf(filename) !== -1) {
      
      fs.removeSync(path.join(assetsDir, filename));
    }
  });
}


var zipName = 'json_viewer.zip';
var zipPath = path.join(BuildPaths.BUILD_DIR, zipName);
var output = fs.createWriteStream(zipPath);
var archive = archiver('zip');

archive.pipe(output);
archive.glob('**', { cwd: BuildPaths.EXTENSION, src: ['**'] });

archive.on("finish", function() {
  var manifest = fs.readJSONSync(path.join(BuildPaths.EXTENSION, 'manifest.json'));
  var version = manifest.version;

  
  fs.copySync(zipPath, path.join(BuildPaths.RELEASE_DIR, version + '/' + zipName));
  
});

archive.finalize();
