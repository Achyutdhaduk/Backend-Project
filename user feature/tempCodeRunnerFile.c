#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

struct Block {
    int id;
    int size;
    int allocated;
};

struct Process {
    int id;
    int size;
    int blockId;  // ID of the allocated block (-1 if not allocated)
};

void firstFit(struct Block* blocks, int numBlocks, struct Process* processes, int numProcesses) {
    int i, j;
    for (i = 0; i < numProcesses; i++) {
        for (j = 0; j < numBlocks; j++) {
            if (!blocks[j].allocated && blocks[j].size >= processes[i].size) {
                blocks[j].allocated = 1;
                processes[i].blockId = blocks[j].id;
                break;
            }
        }
    }
}

void bestFit(struct Block* blocks, int numBlocks, struct Process* processes, int numProcesses) {
    int i, j;
    for (i = 0; i < numProcesses; i++) {
        int bestBlockId = -1;
        int bestBlockSize = INT_MAX;

        for (j = 0; j < numBlocks; j++) {
            if (!blocks[j].allocated && blocks[j].size >= processes[i].size && blocks[j].size < bestBlockSize) {
                bestBlockId = blocks[j].id;
                bestBlockSize = blocks[j].size;
            }
        }

        if (bestBlockId != -1) {
            for (j = 0; j < numBlocks; j++) {
                if (blocks[j].id == bestBlockId) {
                    blocks[j].allocated = 1;
                    processes[i].blockId = blocks[j].id;
                    break;
                }
            }
        }
    }
}

void worstFit(struct Block* blocks, int numBlocks, struct Process* processes, int numProcesses) {
    int i, j;
    for (i = 0; i < numProcesses; i++) {
        int worstBlockId = -1;
        int worstBlockSize = INT_MIN;

        for (j = 0; j < numBlocks; j++) {
            if (!blocks[j].allocated && blocks[j].size >= processes[i].size && blocks[j].size > worstBlockSize) {
                worstBlockId = blocks[j].id;
                worstBlockSize = blocks[j].size;
            }
        }

        if (worstBlockId != -1) {
            for (j = 0; j < numBlocks; j++) {
                if (blocks[j].id == worstBlockId) {
                    blocks[j].allocated = 1;
                    processes[i].blockId = blocks[j].id;
                    break;
                }
            }
        }
    }
}

int main() {
    struct Block blocks[5] = {{1, 100, 0}, {2, 500, 0}, {3, 200, 0}, {4, 300, 0}, {5, 600, 0}};
    struct Process processes[4] = {{1, 212, -1}, {2, 417, -1}, {3, 112, -1}, {4, 426, -1}};

    firstFit(blocks, 5, processes, 4);
    printf("First Fit Allocation:\n");
    printAllocation(blocks, 5, processes, 4);

    printf("\n");

    for (int i = 0; i < 5; i++) {
        blocks[i].allocated = 0; // Reset the allocated flag
    }

    bestFit(blocks, 5, processes, 4);
    printf("Best Fit Allocation:\n");
    printAllocation(blocks, 5, processes, 4);

    printf("\n");

    for (int i = 0; i < 5; i++) {
        blocks[i].allocated = 0; // Reset the allocated flag
    }

    worstFit(blocks, 5, processes, 4);
    printf("Worst Fit Allocation:\n");
    printAllocation(blocks, 5, processes, 4);

    return 0;
}
