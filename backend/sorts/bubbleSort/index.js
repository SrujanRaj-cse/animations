// eval is built in
// but can me misused
// import { bubbleSort } from './bubbleSort';

const runBubbleSort = (code, input) => {

    const wrappedCode = `
        const steps = []
        const array = ${JSON.stringify(input)} ? ${JSON.stringify(input)} : [] ;

        const record = (type, indices, arraySnapShot) => {
            steps.push({type, indices, array: [...arraySnapShot]});
        }

        ${code}

        bubbleSort(array,record);

        steps;
    `;

    // eval automatically returns the last line (steps)
    const result = eval(wrappedCode);
    return result;
}

export default runBubbleSort;
// module.exports = runBubbleSort;