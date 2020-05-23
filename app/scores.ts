import { Cell } from "./types.ts";
import { State } from "./state.ts";
import { BASE_WEIGHT, BASE_MULTIPLIER } from "./weights.ts";
import { SPACE, TAIL, FUTURE_2, FOOD, KILL_ZONE, WALL_NEAR, WARNING, SMALL_DANGER, DANGER, UP, DOWN, LEFT, RIGHT, DIRECTIONS } from "./keys.ts";
import * as log from "./logger.ts";
import { cellToString } from "./utils.ts";


/**
 * Base score for Cell
 * @param cell 
 * @param state 
 */
export const baseScoreForCell = (cell: Cell, state: State): number => {
    
    if (state.grid.outOfBounds(cell)) {
        return BASE_WEIGHT.FORGET_ABOUT_IT;
    }
    log.debug(`Base value for cell ${cellToString(cell)} is ${state.grid.value(cell)}`)
    switch (state.grid.value(cell)) {
        case SPACE:
        case TAIL:
        case FUTURE_2:
            return BASE_WEIGHT.SPACE;
        case FOOD:
            return BASE_WEIGHT.FOOD;
        case KILL_ZONE:
            return (BASE_WEIGHT.KILL_ZONE * BASE_MULTIPLIER.KILL_ZONE);
        case WALL_NEAR:
            return (BASE_WEIGHT.WALL_NEAR * BASE_MULTIPLIER.WALL_NEAR);
        case WARNING:
            return BASE_WEIGHT.WARNING;
        case SMALL_DANGER:
            return BASE_WEIGHT.SMALL_DANGER;
        case DANGER:
            return BASE_WEIGHT.DANGER;
        // default includes SNAKE_BODY, ENEMY_HEAD and YOUR_BODY
        default:
            return BASE_WEIGHT.FORGET_ABOUT_IT;
    }
}


/**
 * Combine two arrays of scores
 * @param scoresA 
 * @param scoresB 
 */
export const combineScores = (scoresA: number[], scoresB: number[]): number[] => {
    let scores = [0, 0, 0, 0];
    try {
      for (let move of DIRECTIONS) {
        if (!isNaN(scoresA[move]) && !isNaN(scoresB[move])) {
          scores[move] = scoresA[move] + scoresB[move];
        }
        if (isNaN(scores[move])) {
            scores[move] = 0;
        }
      }
      return scores;
    }
    catch (e) {
        log.error(`ex in scores.combineScores: ${e}`);
    }
    if (scoresA === null) return scoresB;
    return scoresA;
};



/**
 * subtract the value closest to 0 from all score values, so the lowest score becomes 0
 * @param scores 
 */
export const normalizeScores = (scores: number[]): number[] => {
    try {
      let minAbsScore = 9999;
      let minScore = 0;
      for (let move of DIRECTIONS) {
        let absScore = Math.abs(scores[move]);
        if (absScore < minAbsScore) {
          minAbsScore = absScore;
          minScore = scores[move];
        }
      }
      if (minAbsScore < 9999 && minAbsScore > 0) {
        for (let move of DIRECTIONS) {
          scores[move] -= minScore;
        }
      }
    }
    catch (e) {
        log.error(`ex in scores.normalizeScores: ${e}`);
    }
    return scores;
};


/**
 * get highest score move
 * @param scores 
 */
export const highestScoreMove = (scores: number[]): number => {
    try {
        let bestMove = 0;
        let bestScore = -9999;
        for (let move of DIRECTIONS) {
            if (scores[move] > bestScore) {
                bestScore = scores[move];
                bestMove = move;
            }
        }
        return bestMove;
    }
    catch (e) {
        log.error(`ex in scores.highestScoreMove: ${e}`);
    }
    return RIGHT;
};


/**
 * return scores array in a human readable string
 * @param scores 
 */
export const scoresToString = (scores: number[]) => {
    try {
      let str = "";
      str += `up: ${scores[UP].toFixed(1)}, `;
      str += `down: ${scores[DOWN].toFixed(1)}, `;
      str += `left: ${scores[LEFT].toFixed(1)}, `;
      str += `right: ${scores[RIGHT].toFixed(1)}`;
      return str
    }
    catch (e) {
        log.error("ex in scores.scoresToString: ", e);
    }
};