export class ArrayUtils {
    static toStringSet(array) {
        var uniqueArray = [];
        array.forEach((e) => {
           if (uniqueArray.indexOf(e) === -1) uniqueArray.push(e);
        });
        return uniqueArray;
    }
    static toArraySet(arrayOfArray) {
        var foundElements = {},
            uniqueArray = [];
        arrayOfArray.forEach((array) => {
            if (!foundElements.hasOwnProperty(array.toString())) {
                uniqueArray.push(array);
                foundElements[array.toString()] = true;
            }
        });
        return uniqueArray;
    }
    static toAllSubSets(array) {
        // refs: http://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array
        var op = (n, sourceArray, currentArray, allSubSets) => {
            if (n === 0) {
                if (currentArray.length > 0) {
                    allSubSets[allSubSets.length] = ArrayUtils.toStringSet(currentArray);
                }
            } else {
                for (var j = 0; j < sourceArray.length; j++) {
                    var nextN = n - 1,
                        nextArray = sourceArray.slice(j + 1),
                        updatedCurrentSubSet = currentArray.concat([sourceArray[j]]);
                    op(nextN, nextArray, updatedCurrentSubSet, allSubSets);
                }
            }
        }
        var allSubSets = [];
        array.sort();
        for (var i = 1; i < array.length; i++) {
            op(i, array, [], allSubSets);
        }
        allSubSets.push(array);
        return ArrayUtils.toArraySet(allSubSets);
    }
    static toFixedSizeJoinedSets(itemSets, length) {
        var joinedSetArray = [];
        itemSets.forEach((itemSetA) => {
            itemSets.forEach((itemSetB) => {
                if (ArrayUtils.getDiffArray(itemSetA, itemSetB).length > 0) {
                    var mergedArray = [].concat(itemSetA).concat(itemSetB),
                        joinedSet = ArrayUtils.toStringSet(mergedArray);
                    if (joinedSet.length === length) joinedSetArray.push(joinedSet);
                }
            });
        });
        return ArrayUtils.toArraySet(joinedSetArray);
    }
    static isSubSetArrayOf(targetArray, superSetArray) {
        var isSubSetArray = true;
        targetArray.forEach((item) => {
            if (isSubSetArray && superSetArray.indexOf(item) === -1) isSubSetArray = false;
        });
        return isSubSetArray;
    }
    static getDiffArray(arrayA, arrayB) {
        var diffArray = [];
        arrayA.forEach((e) => { if (arrayB.indexOf(e) === -1) diffArray.push(e); });
        return diffArray;
    }
    
}