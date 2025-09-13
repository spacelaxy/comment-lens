-- Lua Example - Comment Lens Extension
-- This file demonstrates how Comment Lens works with Lua

-- @todo: Implement error handling system
-- @bug: Fix memory leak in coroutine management
-- @note: This module handles game state management
-- @warn: Performance may degrade with many entities
-- @highlight: 10-15 Critical game logic section

local GameState = {}
GameState.__index = GameState

function GameState.new()
    local self = setmetatable({}, GameState)
    
    -- @todo: Add configuration validation
    -- @note: Initialize default values
    self.entities = {}
    self.score = 0
    self.level = 1
    
    -- @highlight: 20-25 Entity management setup
    self.maxEntities = 100
    self.entityCount = 0
    
    return self
end

function GameState:addEntity(entity)
    -- @bug: Check for nil entity before adding
    if not entity then
        print("Error: Cannot add nil entity")
        return false
    end
    
    -- @warn: Check entity limit before adding
    if self.entityCount >= self.maxEntities then
        print("Warning: Maximum entities reached")
        return false
    end
    
    -- @note: Add entity to the list
    table.insert(self.entities, entity)
    self.entityCount = self.entityCount + 1
    
    -- @highlight: 35-40 Entity processing logic
    if entity.type == "player" then
        self.score = self.score + 10
    elseif entity.type == "enemy" then
        self.score = self.score + 5
    end
    
    return true
end

function GameState:update(deltaTime)
    -- @todo: Optimize update loop performance
    -- @note: Process all entities
    for i = #self.entities, 1, -1 do
        local entity = self.entities[i]
        
        -- @highlight: 50-55 Entity update logic
        if entity and entity.update then
            entity:update(deltaTime)
        end
        
        -- @bug: Remove destroyed entities
        if entity and entity.destroyed then
            table.remove(self.entities, i)
            self.entityCount = self.entityCount - 1
        end
    end
end

-- @warn: Add error handling for main function
-- @note: This is the main entry point
function main()
    print("Game started")
    
    -- @highlight: 65-70 Game initialization
    local gameState = GameState.new()
    
    -- Add some test entities
    local player = { type = "player", update = function() end }
    local enemy = { type = "enemy", update = function() end }
    
    gameState:addEntity(player)
    gameState:addEntity(enemy)
    
    print("Entities added:", gameState.entityCount)
    print("Score:", gameState.score)
end

-- @todo: Add proper error handling
main()
