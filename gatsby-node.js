const path = require('path');

exports.createPages = ({ graphql, actions, reporter }) => {
    const { createPage } = actions

    const postTemplate = path.resolve('src/templates/blog-post.js');

    return graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        html
                        id
                        frontmatter {
                            path
                            title
                            date
                            author
                        }
                    }
                }
            }
        }
    `).then(res => {
        if (res.errors) {
            reporter.panicOnBuild(`Error while running GraphQL query.`);
            return;
        }

        res.data.allMarkdownRemark.edges.forEach(({ node }) => {
            const path = node.frontmatter.path
            createPage({
                path,
                component: postTemplate,
                context: {
                    pagePath: path
                }
            });
        });
    })
};
