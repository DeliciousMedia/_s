# DM Base Theme

This is the base WordPress theme we use at [Delicious Media](https://www.deliciousmedia.co.uk/) for most of our projects. It is based on [_s](http://underscores.me/) by Automattic. It's designed to be used in conjunction with [our provisioning script](https://github.com/DeliciousMedia/DM-VVV2-Provision-Basic), but you can rename things manually by following the instructions on the undescores repository.

## Development Notes

This theme uses Gulp (v4) to automate compilation of SASS into CSS, minification of JS/CSS and optimisation of images. It requires NPM & Gulp CLI.

By default image minification uses `imagemin-mozjpeg` which is lossy set to 90% this should be imperceptible, but if this is unacceptable for a project switch to `jpegtran` which is lossless. This will result in significantly larger files. 

- Source SASS files are in `/content/themes/THEMENAME/src/sass/` and are compiled into `/content/THEMENAME/assets/css/`
- Source JavaScript are in `/content/themes/THEMENAME/src/js/` and are placed in `/content/themes/THEMENAME/assets/js/`
- Source images are in `/content/themes/THEMENAME/src/img/` and are placed in `/content/THEMENAME/assets/img/`

The gulp tasks will create minified and unminified versions of CSS and JavaScript; by default the minified versions are only used in live, this is controlled by the `WP_DEBUG` constant which you should set to true in local-config.php (this is done automatically set on `DEV` and `STAGE`).

To get started, install the required node modules.

```
cd content/themes/THEMENAME
npm install
```

To build the theme (e.g. upon deployment):

`gulp build`

To build & watch (e.g. for development):

`gulp`

To build the theme with RTL support (e.g. upon deployment):

`gulp build-rtl`

To build & watch with RTL support (e.g. for development):

`gulp start-rtl`