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

      // Creates an object to store information for the simulation.
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

      // Function to keep track of the frequency of each dice roll.
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
         var simulation, textArea, analysisCanvas, analysisContext, newFrequency, selectedDie, die, quantity, groups, iterations, i, j, k, l, result, resultArray, barHeight;

         // Initialize variables.
         simulation = createSimulation();
         textArea = document.querySelector('#text-area');
         resultArray = [];

         // Write instructions in the text area on page load.
         textArea.textContent += 'To use this simulation, press the \'Simulate\' button.\n\n';
         textArea.textContent += 'Quantity: The number of dice you want to roll at one time.\n';
         textArea.textContent += 'Groups: The number of times you want to roll your quantity of dice per iteration.\n';
         textArea.textContent += 'Iterations: The number of times you want to run the simulation.\n\n';
         textArea.textContent += 'None: No modifier to the quantity total.\n';
         textArea.textContent += 'Top n - X: Takes the top (n - X) dice in your roll.\n';
         textArea.textContent += 'Bottom n - X: Take the bottom (n - X) dice in your roll.\n\n';
         textArea.textContent += 'Some starter values to try: d6, 5, 1, 1000. [None, Top (n - 1), Bottom (n - 1)]';

         // Get the canvas object and its two-dimensional rendering context.
         analysisCanvas = document.querySelector('#analysis-canvas');
         analysisContext = analysisCanvas && analysisCanvas.getContext && analysisCanvas.getContext('2d');

         // Size the canvas.
         analysisCanvas.width = screen.width - 100;
         analysisCanvas.height = 500;  // default height

         // Update the view.
         updateCanvas = function (value) {
            // Declare vars
            var numOfBars, barWidth, previousBarHeight, barPositionX, barPositionY, textLocationX;

            // Initialize vars
            numOfBars = (quantity * die) - (quantity - 1);
            barWidth = analysisCanvas.width / numOfBars;
            newFrequency[value - 1] += 1;
            barHeight = newFrequency[value - 1];
            previousBarHeight = barHeight - 1;
            barPositionX = barWidth * (value - 1);
            barPositionY = analysisCanvas.height - 25;
            textLocationX = value + (quantity - 1);

            // Clear previous quantity label
            analysisContext.fillStyle = 'rgb(255, 255, 255)';
            analysisContext.fillText(newFrequency[value - 1] - 1, barPositionX + barWidth / 2, analysisCanvas.height - previousBarHeight - 30);
            analysisContext.fillText(newFrequency[value - 1] - 1, barPositionX + barWidth / 2, analysisCanvas.height - previousBarHeight - 30);
            analysisContext.fillText(newFrequency[value - 1] - 1, barPositionX + barWidth / 2, analysisCanvas.height - previousBarHeight - 30);

            // Clear previous group label
            analysisContext.fillText(textLocationX, barPositionX + barWidth / 2, analysisCanvas.height - 5);

            // Apply the update
            analysisContext.fillStyle = 'rgb(' + Math.floor(((Math.random() * 185) + 50)) + ', ' + Math.floor(((Math.random() * 185) + 50)) + ', ' + Math.floor(((Math.random() * 185) + 50)) + ')';
            analysisContext.fillRect(barPositionX, barPositionY, barWidth, -barHeight);

            // Set label information
            analysisContext.fillStyle = 'rgb(0, 0, 0)';
            analysisContext.font = '12px sans-serif';
            analysisContext.textAlign = 'center';

            // Write new group label
            analysisContext.fillText(textLocationX, barPositionX + barWidth / 2, analysisCanvas.height - 5);

            // Write new quantity label
            analysisContext.fillText(newFrequency[value - 1], barPositionX + barWidth / 2, analysisCanvas.height - barHeight - 30);
         };

         // Run simulation when button is clicked.
         document.querySelector('#roll').addEventListener('click', function () {
            // Declare vars
            var modifierBottom, modifierTop, r;

            // Initialize vars
            selectedDie = document.querySelector('#select-menu');
            die = selectedDie.value;
            quantity = document.querySelector('#quantity').value;
            groups = document.querySelector('#groups').value;
            iterations = document.querySelector('#iterations').value;
            newFrequency = createFrequencyAnalysis((quantity * die) - (quantity - 1));
            modifierTop = document.querySelector('#modifier-top-value').value;
            modifierBottom = document.querySelector('#modifier-bottom-value').value;

            // Reset the canvas
            analysisContext.fillStyle = 'rgb(255, 255, 255)';
            analysisContext.fillRect(0, 0, analysisCanvas.width, analysisCanvas.height);

            // Reset the previous results
            textArea.textContent = '';

            // Run simulation
            if (quantity == 0 || groups == 0 || iterations == 0) {
               textArea.textContent += 'Invalid parameters, please try again.';
            } else {
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
                     }

                     // Check if the modifier-top button is selected and there is a valid value
                     if (document.querySelector('#modifier-top').checked && modifierTop >= 0 && modifierTop < quantity) {
                        resultArray.sort(function (a, b) {
                           return b - a;
                        });

                        for (r = 0; r < modifierTop; r += 1) {
                           resultArray.pop();
                        }
                     }

                     // Check if the modifier-bottom button is selected and there is a valid value
                     if (document.querySelector('#modifier-bottom').checked && modifierBottom >= 0 && modifierBottom < quantity) {
                        resultArray.sort(function (a, b) {
                           return a - b;
                        });

                        for (r = 0; r < modifierBottom; r += 1) {
                           resultArray.pop();
                        }
                     }

                     // Add each roll together into the group total
                     for (l = 0; l < resultArray.length; l += 1) {
                        simulation.setQuantityTotal(simulation.getQuantityTotal() + resultArray[l]);
                     }

                     // Print out the individual rolls and group total to the text area
                     textArea.textContent += resultArray.join(", ");
                     textArea.textContent += '\n' + 'Group total: ' + simulation.getQuantityTotal() + '\n';

                     // Add each group total together into the iteration total
                     simulation.setGroupTotal(simulation.getGroupTotal() + simulation.getQuantityTotal());
                  }

                  // Print out the iteration total to the text area
                  textArea.textContent += 'Iteration total: ' + simulation.getGroupTotal() + '\n';
                  textArea.textContent += '\n';

                  // Add the iteration total to the newFrequency object to use when graphing
                  newFrequency[i] += simulation.getGroupTotal();

                  // Update the canvas with this iteration
                  updateCanvas(Math.round(simulation.getGroupTotal() / groups) - (quantity - 1));
               }
            }

            // Reset object used for the simulation of dice rolls
            createFrequencyAnalysis(0);

         });
      }());
   }());
}, false);
