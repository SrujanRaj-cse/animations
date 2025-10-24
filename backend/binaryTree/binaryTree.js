class Node{
    constructor(val,left,right){
        this.val = val;
        this.left = left;
        this.right = right;
    }

    setR(Node){
        this.right = Node;
    }

    setL(Node){
        this.left = Node;
    }
};