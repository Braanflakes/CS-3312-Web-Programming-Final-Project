/*jslint browser: true, indent: 3*/

// CS 3312, spring 2016
// Final Project
// Brendan Murphey, Dobby Maxwell

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Simulate //
   (function () {
      var createSimulation, createFrequencyAnalysis, updateCanvas;

      createSimulation = function () {
         var self, state;

         state = {
            die: 0,
            quantityTotal: 0,
            groupTotal: 0
         };

         // Functions for the simulation object.
         self = {
            rollDie: function (die) {
               state.die = Math.floor(((Math.random() * die) + 1));
               return state.die;
            },
            getQuantityTotal: function () {
               return state.quantityTotal;
            },
            getGroupTotal: function () {
               return state.groupTotal;
            },
            setQuantityTotal: function (total) {
               state.quantityTotal = total;
            },
            setGroupTotal: function (total) {
               state.groupTotal = total;
            },
            reset: function () {
               state.die = 0;
               state.quantityTotal = 0;
               state.groupTotal = 0;
            }
         };
         return self;
      };

      createFrequencyAnalysis = function (iterations) {
         var newFrequency, i;
         newFrequency = {};
         
         for (i = 0; i < iterations; i += 1) {
            newFrequency[i] = 0;
         }

         return newFrequency;
      };

      // Controller //
      (function () {
         var simulation, textArea, analysisCanvas, analysisContext, newFrequency, selectedDie, die, quantity, groups, iterations, i, j, k, l, m, result, resultArray, barHeight;

         simulation = createSimulation();
         textArea = document.querySelector('#text-area');
         resultArray = [];

         // Get the canvas object and its two-dimensional rendering context.
         analysisCanvas = document.querySelector('#analysis-canvas');
         analysisContext = analysisCanvas && analysisCanvas.getContext && analysisCanvas.getContext('2d');

         // Size the canvas.
         //analysisCanvas.width = analysisCanvas.clientWidth;
         analysisCanvas.width = screen.width - 100;
         analysisCanvas.height = 500;  // default height

         // Update the view.
         updateCanvas = function (value) {
            // Declare vars
            var numOfBars, barWidth, previousBarHeight, barPositionX, barPositionY, textLocationX;
            
            // Initialize vars
            numOfBars = (quantity * die) - (quantity - 1);
            barWidth = analysisCanvas.width / numOfBars;
            barHeight = newFrequency[value - 1] += 1;
            previousBarHeight = barHeight - 1;
            barPositionX = barWidth * (value - 1);
            barPositionY = analysisCanvas.height - 25;
            textLocationX = value + (quantity - 1);
            
            // Clear previous label
            analysisContext.fillStyle = 'rgb(255, 255, 255)';
            analysisContext.fillText(newFrequency[value - 1] - 1, barPositionX + barWidth / 2, analysisCanvas.height - previousBarHeight - 30);
            analysisContext.fillText(newFrequency[value - 1] - 1, barPositionX + barWidth / 2, analysisCanvas.height - previousBarHeight - 30);
            analysisContext.fillText(newFrequency[value - 1] - 1, barPositionX + barWidth / 2, analysisCanvas.height - previousBarHeight - 30);
            
            analysisContext.fillText(textLocationX, barPositionX + barWidth / 2, analysisCanvas.height - 5);

            // Apply the update
            analysisContext.fillStyle = 'rgb(' + Math.floor(((Math.random() * 185) + 50)) + ', ' + Math.floor(((Math.random() * 185) + 50)) + ', ' + Math.floor(((Math.random() * 185) + 50)) + ')';
            analysisContext.fillRect(barPositionX, barPositionY, barWidth, -barHeight);
            
            // Set label information
            analysisContext.fillStyle = 'rgb(0, 0, 0)';
            analysisContext.font = '12px sans-serif';
            analysisContext.textAlign = 'center';
            
            // Write new label
            analysisContext.fillText(textLocationX, barPositionX + barWidth / 2, analysisCanvas.height - 5);
            
            // Write labels on top of the values
            analysisContext.fillText(newFrequency[value - 1], barPositionX + barWidth / 2, analysisCanvas.height - barHeight - 30);
            
         };

         // Run simulation when button is clicked.
         document.querySelector('#roll').addEventListener('click', function () {         
            selectedDie = document.querySelector('#select-menu');
            die = selectedDie.value;
            quantity = document.querySelector('#quantity').value;
            groups = document.querySelector('#groups').value;
            iterations = document.querySelector('#iterations').value;
            newFrequency = createFrequencyAnalysis((quantity * die) - (quantity - 1));

            // reset the canvas
            analysisContext.fillStyle = 'rgb(255, 255, 255)';
            analysisContext.fillRect(0, 0, analysisCanvas.width, analysisCanvas.height);
            
            // draw labels
            /*for (var key in newFrequency) {
               if (newFrequency.hasOwnProperty(key)) {
                  analysisContext.fillText(newFrequency[key - 1], barPositionX + barWidth / 2, 300 - barHeight - 10);
               }
            }*/
            
            // reset the previous results
            textArea.textContent = '';

            for (i = 0; i < iterations; i += 1) {
               textArea.textContent += 'Iteration ' + (i + 1) + ' (d' + die + ') ' + '\n';
               simulation.setGroupTotal(0);  // reset the group total
               for (j = 0; j < groups; j += 1) {
                  textArea.textContent += 'Group ' + (j + 1) + '\n';
                  textArea.textContent += quantity + 'd' + die + ': ';
                  simulation.setQuantityTotal(0);  // reset the quantity total
                  resultArray = []; // reset the result array
                  for (k = 0; k < quantity; k += 1) {
                     result = simulation.rollDie(die);
                     resultArray.push(result);
                     textArea.textContent += result;
                  }

                  if (document.querySelector('#modifier-top').checked) {
                     resultArray.sort(function (a, b) {
                        return b - a;
                     });
                     
                     var modifier = document.querySelector('#modifier-value').value;
                     
                     for (var r = 0; r < modifier; r += 1) {
                        resultArray.pop();
                     }
                  }

                  if (document.querySelector('#modifier-bottom').checked) {
                     resultArray.sort(function (a, b) {
                        return a - b;
                     });
                     
                     var modifier = document.querySelector('#modifier-value').value;
                     
                     for (var r = 0; r < modifier; r += 1) {
                        resultArray.pop();
                     }
                  }

                  for (l = 0; l < resultArray.length; l += 1) {
                     simulation.setQuantityTotal(simulation.getQuantityTotal() + resultArray[l]);
                  }

                  textArea.textContent += '\n' + 'Group total: ' + simulation.getQuantityTotal() + '\n';
                  simulation.setGroupTotal(simulation.getGroupTotal() + simulation.getQuantityTotal());
               }
               textArea.textContent += 'Iteration total: ' + simulation.getGroupTotal() + '\n';
               textArea.textContent += '\n';
               
               newFrequency[i] += simulation.getGroupTotal();
               updateCanvas(Math.round(simulation.getGroupTotal() / groups) - (quantity - 1));
            }
            
            createFrequencyAnalysis(0);

         });

         // Results reset button.
         document.querySelector('#results-reset').addEventListener('click', function () {
            textArea.textContent = '';
            simulation.reset();
         });
         
         // X is potential number for dice roll
         // Y would be count of actual roll value
      }());
   }());
}, false);
