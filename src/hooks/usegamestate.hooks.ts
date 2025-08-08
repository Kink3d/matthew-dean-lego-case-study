import { useState, useEffect, useRef, useMemo } from "react";
import { InterfaceState, Level, LevelData, TileData } from '../data';
import { LevelUtils } from "../utils";

export interface GameStateResult {
    // Player
    playerPosition: { x: number; y: number; z: number };
    setPlayerPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
    playerRenderPosition: { x: number; y: number; z: number };
    setPlayerRenderPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
    playerY: number;
    playerScale: number;
    playerTile: TileData | undefined;
    
    // Moves
    movesTaken: number;
    setMovesTaken: React.Dispatch<React.SetStateAction<number>>;
    moving: boolean;
    moveTo: (target: { x: number; y: number; z: number }) => void;
    
    // Enemies
    enemyPositions: [number, number][];
    enemyDirections: [number, number][];
    enemyRenderPositions: [number, number][];
    moveToEnemy: (enemyIndex: number, target: [number, number]) => void;

    // Win
    win: boolean;
    winAnimation: boolean;

    // Death
    isDead: boolean;
    deathAnimation: boolean;

    // Interface
    interfaceState: InterfaceState;
    setInterfaceState: React.Dispatch<React.SetStateAction<InterfaceState>>;
    displayMoveButtons: boolean;

    // Levels
    Levels: Level[];
    levelData: LevelData;
    activeLevelIndex: number;
    setActiveLevelIndex: React.Dispatch<React.SetStateAction<number>>;
    levelLoaded: boolean;
    setLevelLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useGameState(Levels: Level[]) {
    const [activeLevelIndex, setActiveLevelIndex] = useState(0);
    const [interfaceState, setInterfaceState] = useState(InterfaceState.Game);
    const level = Levels[activeLevelIndex];
    const levelData = useMemo(() => LevelUtils.createLevelData(level), [level]);
    const defaultPlayerPosition = { x: levelData.level.startPosition[0], y: 0, z: levelData.level.startPosition[1] };
    const [playerPosition, setPlayerPosition] = useState(defaultPlayerPosition);
    const [playerRenderPosition, setPlayerRenderPosition] = useState(defaultPlayerPosition);
    const [playerTile, setPlayerTile] = useState<TileData | undefined>(undefined);
    const [playerMoved, setPlayerMoved] = useState(false);
    const [win, setWin] = useState(false);
    const [winAnimation, setWinAnimation] = useState(false);
    const [playerY, setPlayerY] = useState(0.5);
    const [movesTaken, setMovesTaken] = useState(0);
    const animRef = useRef<number | null>(null);
    const prevPosRef = useRef(defaultPlayerPosition);
    const [levelLoaded, setLevelLoaded] = useState(true);
    const [moving, setMoving] = useState(false);
    const [displayMoveButtons, setDisplayMoveButtons] = useState(true);
    const [enemyPositions, setEnemyPositions] = useState<[number, number][]>([]);
    const [enemyDirections, setEnemyDirections] = useState<[number, number][]>([]);
    const [enemyRenderPositions, setEnemyRenderPositions] = useState<[number, number][]>([]);
    const enemyAnimRefs = useRef<(number | null)[]>([]);
    const [isDead, setIsDead] = useState(false);
    const [deathAnimation, setDeathAnimation] = useState(false);
    const [playerScale, setPlayerScale] = useState(1);
    const deathAnimRef = useRef<number | null>(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Update playerTile whenever playerPosition changes
    useEffect(() => {
        const tile = levelData.tileDatas.find(td => td.position[0] === playerPosition.x && td.position[1] === playerPosition.z);
        setPlayerTile(tile);
    }, [playerPosition, levelData]);

    // Track moves taken (increment only if not reset)
    useEffect(() => {
        if (!hasInitialized) {
            setHasInitialized(true);
            return;
        }
        // Don't count moves during win animation or initial placement
        if (
            !winAnimation &&
            (prevPosRef.current.x !== playerPosition.x ||
            prevPosRef.current.z !== playerPosition.z)
        ) {
            setMovesTaken(m => m + 1);
        }
        prevPosRef.current = playerPosition;
    }, [playerPosition, levelData, hasInitialized, winAnimation]);

    // Detect win state
    useEffect(() => {
        const goal = levelData.level.goalPosition;
        if (!winAnimation && playerPosition.x === goal[0] && playerPosition.z === goal[1]) {
            setWin(true);
            setWinAnimation(true);
        }
    }, [playerPosition, levelData, winAnimation]);

    // Animate player flying up on win
    useEffect(() => {
        if (!winAnimation) return;
        let y = 0.5;
        const animate = () => {
            y += 0.2;
            setPlayerY(y);
            if (y < 10) {
                animRef.current = requestAnimationFrame(animate);
            } else {
                setWin(false);
                setWinAnimation(false);
                setPlayerY(0.5);
                setInterfaceState(InterfaceState.EndLevel);
                setLevelLoaded(false); // Unload level
                // Update prevPosRef to prevent move counting on this reset
                prevPosRef.current = { x: levelData.level.startPosition[0], y: 0, z: levelData.level.startPosition[1] };
                setPlayerPosition({ x: levelData.level.startPosition[0], y: 0, z: levelData.level.startPosition[1] });
            }
        };
        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [winAnimation, setPlayerPosition, levelData, setInterfaceState, setLevelLoaded]);

    // Reset player position, movesTaken, and load level if level changes or retried
    useEffect(() => {
        if (levelLoaded) {
            setPlayerPosition({ x: levelData.level.startPosition[0], y: 0, z: levelData.level.startPosition[1] });
            setMovesTaken(0);
            setPlayerMoved(false); // Reset playerMoved to ensure enemies move on first move

            // Reset enemies to their starting positions
            const enemies = levelData.level.enemies;
            setEnemyPositions(enemies.map(e => e.startPosition));
            setEnemyRenderPositions(enemies.map(e => e.startPosition));
            setEnemyDirections(enemies.map(e => e.initialDirection));

            // Clear any ongoing enemy animations
            enemyAnimRefs.current.forEach(ref => {
                if (ref) cancelAnimationFrame(ref);
            });
            enemyAnimRefs.current = new Array(enemies.length).fill(null);
        }
    }, [levelData, levelLoaded]);

    // Initialize enemy positions and directions when level changes
    useEffect(() => {
        const enemies = levelData.level.enemies;
        const positions = enemies.map(e => e.startPosition);
        setEnemyPositions(positions);
        setEnemyRenderPositions(positions);
        setEnemyDirections(enemies.map(e => e.initialDirection));
        enemyAnimRefs.current = new Array(enemies.length).fill(null);
    }, [levelData]);

    // Smooth enemy move logic
    const moveToEnemy = (enemyIndex: number, target: [number, number]) => {
        if (enemyAnimRefs.current[enemyIndex]) return;
        enemyAnimRefs.current[enemyIndex] = 1;
        const speed = 0.15;
        const animate = () => {
            setEnemyRenderPositions(prev => {
                const newPositions = [...prev];
                const current = newPositions[enemyIndex];
                const dx = target[0] - current[0];
                const dy = target[1] - current[1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < speed) {
                    newPositions[enemyIndex] = target;
                    enemyAnimRefs.current[enemyIndex] = null;
                    setPlayerMoved(false);
                    return newPositions;
                }
                const nx = current[0] + (dx / dist) * speed;
                const ny = current[1] + (dy / dist) * speed;
                newPositions[enemyIndex] = [nx, ny];
                enemyAnimRefs.current[enemyIndex] = requestAnimationFrame(animate);
                return newPositions;
            });
        };
        enemyAnimRefs.current[enemyIndex] = requestAnimationFrame(animate);
    };

    // Move enemies when player moves
    useEffect(() => {
        if (winAnimation) return; // Don't move during win animation
        if (!playerMoved) return;

        const moveEnemies = () => {
            setEnemyPositions(prevPositions => {
                return prevPositions.map((pos, i) => {
                    const direction = enemyDirections[i];
                    if (!direction) return pos; // Safety check
                    
                    const newPos: [number, number] = [pos[0] + direction[0], pos[1] + direction[1]];
                    
                    // Check if new position is valid (has nav in that direction)
                    const currentTile = levelData.tileDatas.find(td => td.position[0] === pos[0] && td.position[1] === pos[1]);
                    if (!currentTile || !currentTile.nav) {
                        // Flip direction and immediately move
                        const newDirection = [-direction[0], -direction[1]] as [number, number];
                        setEnemyDirections(prev => {
                            const newDirs = [...prev];
                            if (newDirs[i]) {
                                newDirs[i] = newDirection;
                            }
                            return newDirs;
                        });
                        const immediateNewPos: [number, number] = [pos[0] + newDirection[0], pos[1] + newDirection[1]];
                        moveToEnemy(i, immediateNewPos);
                        return immediateNewPos;
                    }

                    // Check if we can move in the current direction
                    const canMove = 
                        (direction[0] === -1 && currentTile.nav.up) ||
                        (direction[0] === 1 && currentTile.nav.down) ||
                        (direction[1] === -1 && currentTile.nav.left) ||
                        (direction[1] === 1 && currentTile.nav.right);

                    if (canMove) {
                        moveToEnemy(i, newPos);
                        return newPos;
                    } else {
                        // Flip direction and immediately move
                        const newDirection = [-direction[0], -direction[1]] as [number, number];
                        setEnemyDirections(prev => {
                            const newDirs = [...prev];
                            if (newDirs[i]) {
                                newDirs[i] = newDirection;
                            }
                            return newDirs;
                        });
                        const immediateNewPos: [number, number] = [pos[0] + newDirection[0], pos[1] + newDirection[1]];
                        moveToEnemy(i, immediateNewPos);
                        return immediateNewPos;
                    }
                });
            });
        };

        moveEnemies();
    }, [movesTaken, levelData, winAnimation]);

    // Smooth move logic
    const moveTo = (target: { x: number; y: number; z: number }) => {
        if (moving) return;
        setMoving(true);
        let animId: number | null = null;
        const speed = 0.001;
      
        function animate() {
          setPlayerRenderPosition(prev => {
            const dx = target.x - prev.x;
            const dz = target.z - prev.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < speed) {
              setMoving(false);
              setPlayerRenderPosition(target);
              setPlayerPosition(target);
              return target;
            }
            const nx = prev.x + (dx / dist) * speed;
            const nz = prev.z + (dz / dist) * speed;
            // Schedule next frame
            animId = requestAnimationFrame(animate);
            return { x: nx, y: 0, z: nz };
          });
          
        }
        animId = requestAnimationFrame(animate);
        setPlayerMoved(true);
      };

    // When playerPosition changes (not from animation), update render position instantly (e.g. on reset)
    useEffect(() => {
        if (!moving) setPlayerRenderPosition(playerPosition);
    }, [playerPosition, moving]);

    // Update displayMoveButtons based on moving and winAnimation
    useEffect(() => {
        setDisplayMoveButtons(!(moving || winAnimation));
    }, [moving, winAnimation]);

    // Check for collisions between player and enemies
    const checkCollision = (playerPos: [number, number], enemyPositions: [number, number][]) => {
        return enemyPositions.some(enemyPos => 
            Math.abs(playerPos[0] - enemyPos[0]) < 0.1 && Math.abs(playerPos[1] - enemyPos[1]) < 0.1
        );
    };

    // Death animation
    const triggerDeath = () => {
        setIsDead(true);
        setDeathAnimation(true);
        setDisplayMoveButtons(false);
        let scale = 1;
        const animate = () => {
            scale -= 0.05;
            setPlayerScale(scale);
            if (scale > 0) {
                deathAnimRef.current = requestAnimationFrame(animate);
            } else {
                setDeathAnimation(false);
                setIsDead(false);
                setPlayerScale(1);

                // Reset level
                setPlayerPosition({ x: levelData.level.startPosition[0], y: 0, z: levelData.level.startPosition[1] });
                setPlayerRenderPosition({ x: levelData.level.startPosition[0], y: 0, z: levelData.level.startPosition[1] });
                setMovesTaken(0);
                
                setEnemyPositions(levelData.level.enemies.map(e => e.startPosition));
                setEnemyRenderPositions(levelData.level.enemies.map(e => e.startPosition));
                setEnemyDirections(levelData.level.enemies.map(e => e.initialDirection));
                setDisplayMoveButtons(true);
            }
        };
        deathAnimRef.current = requestAnimationFrame(animate);
    };

    // Check for collisions when player moves
    useEffect(() => {
        if (isDead || deathAnimation) return;
        const playerPos: [number, number] = [playerPosition.x, playerPosition.z];
        if (checkCollision(playerPos, enemyPositions)) {
            triggerDeath();
        }
    }, [playerPosition, enemyPositions, isDead, deathAnimation, levelData]);

    // Check for collisions when enemies move
    useEffect(() => {
        if (isDead || deathAnimation) return;
        const playerPos: [number, number] = [playerPosition.x, playerPosition.z];
        if (checkCollision(playerPos, enemyRenderPositions)) {
            triggerDeath();
        }
    }, [enemyRenderPositions, playerPosition, isDead, deathAnimation]);

    return {
        playerPosition,
        setPlayerPosition,
        playerRenderPosition,
        setPlayerRenderPosition,
        playerTile,
        win,
        winAnimation,
        playerY,
        activeLevelIndex,
        setActiveLevelIndex,
        interfaceState,
        setInterfaceState,
        levelData,
        Levels,
        movesTaken,
        setMovesTaken,
        levelLoaded,
        setLevelLoaded,
        moving,
        moveTo,
        displayMoveButtons,
        enemyPositions,
        enemyDirections,
        enemyRenderPositions,
        moveToEnemy,
        isDead,
        deathAnimation,
        playerScale,
    };
}
