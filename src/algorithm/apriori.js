export class AnalysisResult {
    frequentItemSets;
    associationRules;

    constructor(frequentItemSets, associationRules) {
        this.frequentItemSets = frequentItemSets;
        this.associationRules = associationRules;
    }
}

export class FrequentItemSet {
    itemSet;
    support;

    constructor(itemSet, support) {
        this.itemSet = itemSet;
        this.support = support;
    }
}

export class AssociationRule {
    lhs;
    rhs;
    confidence;

    constructor(lhs, rhs, confidence) {
        this.lhs = lhs;
        this.rhs = rhs;
        this.confidence = confidence;
    }
}

export class Algorithm {
    minSupport;
    minConfidence;
    debugMode;

    constructor(minSupport, minConfidence, debugMode) {
        this.minSupport = minSupport ? minSupport === 0 ? 0 : minSupport : 0.15;
        this.minConfidence = minConfidence ? minConfidence === 0 ? 0 : minConfidence : 0.6;
        this.debugMode = debugMode || false;
    }

    analyze(transactions) {
        var self = this;
        var beforeMillis = new Date().getTime();

        var frequencies = {};
        var frequentItemSets = {};

        var oneElementItemSets = self.toOneElementItemSets(transactions);
        var oneCItemSets = self.findItemSetsMinSupportSatisfied(
            oneElementItemSets, transactions, self.minSupport, frequencies);
        var currentLItemSets = oneCItemSets;
        var itemSetSize = 1;

        if (self.debugMode) {
            console.log('Before finding item sets: ' + self.getTime(beforeMillis) + ' ms');
        }
        var extractItemSet = (f) => { return f.itemSet };
        while (currentLItemSets.length !== 0) {
            frequentItemSets[itemSetSize] = currentLItemSets;
            var joinedSets = ArrayUtils.toFixedSizeJoinedSets(currentLItemSets.map(extractItemSet), itemSetSize + 1);
            currentLItemSets = self.findItemSetsMinSupportSatisfied(joinedSets, transactions, self.minSupport, frequencies);
            itemSetSize += 1;
        }
        if (self.debugMode) {
            console.log('After finding item sets: ' + self.getTime(beforeMillis) + ' ms');
        }

        // local function which returns the support of an item
        var calculateSupport = (
            itemSet,
            frequencies,
            transactions) => {
            var frequency = frequencies[itemSet.toString()];
            return frequency ? frequency / transactions.length : 0;
        };
        var foundSubSets = [];
        var isTheRuleAlreadyFound = (itemSet) => {
            var found = false;
            foundSubSets.forEach((subset) => { if (!found) found = subset.toString() === itemSet.toString(); });
            return found;
        };

        if (self.debugMode) {
            console.log('Before calculating association rules: ' + self.getTime(beforeMillis) + ' ms');
        }
        var associationRules = [];
        var currentItemSet;
        var saveAssociationRuleIfFound = (subsetItemSet) => {
            var diffItemSet = ArrayUtils.getDiffArray(currentItemSet, subsetItemSet);
            if (diffItemSet.length > 0) {
                var itemSupport = calculateSupport(currentItemSet, frequencies, transactions),
                    subsetSupport = calculateSupport(subsetItemSet, frequencies, transactions),
                    confidence = itemSupport / subsetSupport;

                if (!isNaN(confidence) && !isTheRuleAlreadyFound(subsetItemSet) && confidence >= self.minConfidence) {
                    foundSubSets.push(subsetItemSet);
                    associationRules.push(new AssociationRule(subsetItemSet, diffItemSet, confidence));
                }
            }
        };
        var saveAllAssociationRulesIfFound = (itemSet) => {
            currentItemSet = itemSet;
            ArrayUtils.toAllSubSets(currentItemSet).forEach(saveAssociationRuleIfFound);
        };
        for (var k in frequentItemSets) {
            var itemSets = frequentItemSets[k].map(extractItemSet);
            if (itemSets.length === 0 || itemSets[0].length <= 1) {
                continue;
            }
            itemSets.forEach(saveAllAssociationRulesIfFound)
        }
        if (self.debugMode) {
            console.log('After calculating association rules: ' + self.getTime(beforeMillis) + ' ms');
        }

        var analysisResult = new AnalysisResult(frequentItemSets, associationRules);
        if (self.debugMode) {
            console.log('AnalysisResult: ' + JSON.stringify(analysisResult))
            console.log('Apriori.Algorithm\'s total spent time: ' + self.getTime(beforeMillis) + ' ms');
        }
        return analysisResult;
    }

    toOneElementItemSets(transactions) {
        var nestedArrayOfItem = [];
        transactions.forEach((transaction) => {
            transaction.forEach((item) => { nestedArrayOfItem.push(new Array(item)); });
        });
        return ArrayUtils.toArraySet(nestedArrayOfItem);
    }

    findItemSetsMinSupportSatisfied(itemSets, transactions, minSupport, frequencies) {

        var filteredItemSets = [],
            localFrequencies = {};

        itemSets.forEach((itemSet) => {
            transactions.forEach((transaction) => {
                if (ArrayUtils.isSubSetArrayOf(itemSet, transaction)) {
                    if (!frequencies[itemSet.toString()]) frequencies[itemSet.toString()] = 0;
                    if (!localFrequencies[itemSet.toString()]) localFrequencies[itemSet.toString()] = 0;
                    frequencies[itemSet.toString()] += 1;
                    localFrequencies[itemSet.toString()] += 1;
                }
            });
        });
        var alreadyAdded = false;
        var setAsAlreadyAddedIfFound = (f) => {
            if (!alreadyAdded) alreadyAdded = f.itemSet.toString() === itemSet.toString();
        };
        for (var strItemSet in localFrequencies) {
            var itemSet = strItemSet.split(',').sort(),
                localCount = localFrequencies[itemSet.toString()],
                support = localCount / transactions.length;

            if (support >= minSupport) {
                alreadyAdded = false;
                filteredItemSets.forEach(setAsAlreadyAddedIfFound);
                if (!alreadyAdded) {
                    filteredItemSets.push(new FrequentItemSet(itemSet, support));
                }
            }
        }
        return filteredItemSets;
    }

    // runs on the Node.js runtime
    showAnalysisResultFromFile(filename) {
        var self = this;
        require('fs').readFile(filename, 'utf8', (err, data) => {
            if (err) throw err;
            var transactions = ArrayUtils.readCSVToArray(data, ',');
            var analysisResult = self.analyze(transactions);
            console.log(JSON.stringify(analysisResult.associationRules));
        });
    }

    getTime(initial) {
        return new Date().getTime() - initial;
    }
}

// yes, reinvention of the wheel. Just for no dependency.
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

