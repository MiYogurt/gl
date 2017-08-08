import * as g from 'gulp'
import * as htmlImport from 'gulp-html-import'
import * as del from 'del'
import * as stylus from 'gulp-stylus'
import * as BS from 'browser-sync'
import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import * as run from 'run-sequence'

const browserSync = BS.create()
const tsProject = ts.createProject('tsconfig.json')

g.task('log', () => {
    console.log("======log======")
})

g.task('template', () => {
    g.src(['src/**/*.html', '!src/**/_*.html'])
        .pipe(htmlImport('src/'))
        .pipe(g.dest('build'))
        .pipe(browserSync.stream())
})

g.task('clean', () => {
    del.sync('build')
})

g.task('styl', () => {
    g.src(['src/**/*.styl', '!src/**/_*.styl'])
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(sourcemaps.write('.'))
        .pipe(browserSync.stream())
        .pipe(g.dest('build'))
})

g.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
});

g.task('static', () => {
    g.src('src/assets/**')
        .pipe(g.dest('build/assets/'))
})

g.task('ts', () => {
    g.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(g.dest('build'))
})

g.task('reload', browserSync.reload)

g.watch('src/**', (...args) => {
    console.log("============ args ");
    console.log(args);
    console.log("++++++++++++ args ");
    run(['styl', 'template', 'ts'], 'static', 'reload');
})

