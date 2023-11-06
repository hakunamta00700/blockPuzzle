from loguru import logger
# 8x8 격자 초기화
grid = [['-' for _ in range(8)] for _ in range(8)]

# 블록 데이터
blocks = [
    { "color": 'Aqua', "cells": [[0, 0], [1, 0], [1, 1], [2, 2], [1, 2]] },
    { "color": 'Beige', "cells": [[0, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
    { "color": 'Coral', "cells": [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
    { "color": 'DodgerBlue', "cells": [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3]] },
    { "color": 'ForestGreen', "cells": [[1, 0], [1, 1], [0, 2], [1, 2], [2, 2]] },
    { "color": 'Gold', "cells": [[0, 0], [1, 0], [0, 1], [1, 1]] },
    { "color": 'HotPink', "cells": [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
    { "color": 'Ivory', "cells": [[0, 0], [1, 0], [1, 1], [0, 2], [1, 2]] },
    { "color": 'Khaki', "cells": [[1, 0], [2, 0], [1, 1], [0, 1], [0, 2]] },
    { "color": 'Lavender', "cells": [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]] },
    { "color": 'Moccasin', "cells": [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1]] },
    { "color": 'Navy', "cells": [[3, 0], [0, 1], [1, 1], [2, 1], [3, 1]] },
    { "color": 'Olive', "cells": [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] }
]
def is_valid_placement(grid, block, x, y):
    for dx, dy in block['cells']:
        if x + dx < 0 or x + dx >= 8 or y + dy < 0 or y + dy >= 8 or grid[y + dy][x + dx] != '-':
            return False
    return True

def place_block(grid, block, x, y):
    for dx, dy in block['cells']:
        grid[y + dy][x + dx] = block['color'][0].upper()
    logger.info(f"Placed block: {block['color']} at {x}, {y}")

def remove_block(grid, block, x, y):
    for dx, dy in block['cells']:
        grid[y + dy][x + dx] = '-'
    logger.info(f"Removed block: {block['color']} from {x}, {y}")
def save_solution_to_file(grid):
    global solution_count
    solution_count += 1
    filename = f"solution_{solution_count}.txt"
    with open(filename, 'w') as f:
        for row in grid:
            f.write(''.join(row) + '\n')
    logger.info(f"Saved solution to {filename}")
def solve(grid, blocks, index):
    if index == len(blocks):
        for row in grid:
            logger.success(''.join(row))
        logger.success("\nSolution found\n")
        save_solution_to_file(grid)  # 솔루션을 파일에 저장합니다.
        return True

    block = blocks[index]
    for x in range(8):
        for y in range(8):
            if is_valid_placement(grid, block, x, y):
                place_block(grid, block, x, y)
                if solve(grid, blocks, index + 1):
                    return True
                remove_block(grid, block, x, y)
    return False

if not solve(grid, blocks, 0):
    logger.error("No solution exists")