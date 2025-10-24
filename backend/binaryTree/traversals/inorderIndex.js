import { inorderTrav } from "./inorder.js";

export const runInorderTrav = (code,node) => {
    const steps = [];

    const record = (type,prev,node) => {
        steps.push({
            type,
            prev,
            node
        });
    };

    inorderTrav(node, record);

    return steps;
};

// const runInorderTrav = (code,node) => {
//     const wrappedCode = `
//         const steps = []
//         const nodee = ${JSON.stringify(node)} ? ${JSON.stringify(node)} : null;

//         const record = (type, node) => {
//             steps.push({type, node});    
//         }

//         ${code}
//         inorderTrav(nodee,record);

//         steps;
//     `;

//     const result = eval(wrappedCode);
//     return result;
// }

export default runInorderTrav;