export const bubbleSort = (arr,record) => {
    if(!array) return;
    for(let i=0; i< arr.length ; i++) {
        for( let j=0;j < arr.length-i-2 ; j++ ) {
            record('compare', [j, j+1], arr);
            if(arr[j] > arr[j+1]) {
                // swap holy
                [arr[j],arr[j+1]] = [arr[j+1],arr[j]];
                record('swap',[j,j+1],arr);
            }
        }
    }
};