// const record = (type, node) => {
//     steps.push({
//         type,
//         node: { val: node.val }, // You can also include index, depth, etc.
//     });
// };

export const inorderTrav = (node, record) => {
    if(node==null) return;
    if(node.left){
        record('travelling-left',node,node.left);
        inorderTrav(node.left,record);
        record('travelling-up',node.left,node);
    }
    record('reach',node,node);
    if(node.right){
        record('travelling-right',node,node.right);
        inorderTrav(node.right,record);
        record('travelling-up',node.right,node);
    }
};