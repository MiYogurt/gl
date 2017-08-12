import * as g from 'gulp'
import * as htmlImport from 'gulp-html-import'
import * as del from 'del'
import * as stylus from 'gulp-stylus'
import * as BS from 'browser-sync'
import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import * as run from 'run-sequence'
import * as combiner from 'stream-combiner2';
import * as gulpIgnore from 'gulp-ignore'

const browserSync = BS.create()

g.task('log', () => {
    console.log("======log======")
})

g.task('template', () => {
    const combined = combiner.obj([
        g.src(['src/**/*.html', '!src/**/_*.html']),
        htmlImport('src/'),
        browserSync.stream(),
        g.dest('build')
    ])
    combined.on('error', console.error.bind(console))
    return combined;
})

g.task('clean', () => {
    del.sync('build')
})

g.task('styl', () => {
    const combined = combiner.obj([
        g.src(['src/**/*.styl', '!src/**/_*.styl']),
        sourcemaps.init(),
        stylus(),
        sourcemaps.write('.'),
        browserSync.stream(),
        g.dest('build')
    ])
    combined.on('error', console.error.bind(console))
    return combined;
})

g.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });

    g.watch('src/**', (...args) => {
        console.log("============ args ");
        console.log(args);
        console.log("++++++++++++ args ");
        run(['styl', 'template'],'ts', 'static', 'reload');
    })

});

g.task('static', () => {
    g.src('src/assets/**')
        .pipe(g.dest('build/assets/'))
})

g.task('ts', () => {
    const tsProject = ts.createProject('tsconfig.json')
    g.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(g.dest('build'))
})

g.task('reload', browserSync.reload)
