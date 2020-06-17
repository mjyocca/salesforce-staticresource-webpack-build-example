const path = require('path');
/* creates static resource xml file in ./force-app/main/default/staticresources directory */
const StaticResourceCreate = require('static-resource-webpack-plugin');
/* automatically deploys modified/changed files in ./force-app project by default after webpack compilation */
const SfdxDeploy = require('sfdx-deploy-webpack-plugin');
/* */
const VisualforcePlugin = require('visualforce-template-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// Attention: Optional but could potentially delete non webpack generated static assets in static resource directory
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const staticResourcePath =  path.resolve('./force-app/main/default/staticresources/');
const ignoreTemplate = path.resolve(__dirname, 'git-ignore-template.txt');

module.exports = {
    entry: {
        main: path.resolve('./app/index.js'),
        admin: path.resolve('./app/admin.js')
    },
    output: {
        filename: '[name]/dist/[name].bundle.js',
        path: staticResourcePath
    },
    plugins: [
        // new CleanWebpackPlugin({verbose: true}),
        new VisualforcePlugin({
            entry: 'main',
            page: path.resolve('./force-app/main/default/components/AppBundles.component')
        }),
        new StaticResourceCreate({
            staticResPath: staticResourcePath
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: ignoreTemplate,
                    to: `${staticResourcePath}/main/.gitignore`,
                    toType: 'template'
                },
                {
                    from: ignoreTemplate,
                    to: `${staticResourcePath}/admin/.gitignore`,
                    toType: 'template'
                }
            ]
        }),
        new SfdxDeploy()
    ]
}