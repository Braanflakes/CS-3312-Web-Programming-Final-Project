/*jslint browser: true, indent: 3*/

// CS 3312, spring 2016
// Final Project
// Brendan Murphey, Dobby Maxwell

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Simulate //
   (function () {
      var createSimulation;

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

      // View //

      // Controller //
      (function () {
         var simulation, textArea, selectedDie, die, quantity, groups, iterations, i, j, k, l, result, resultArray;

         simulation = createSimulation();
         textArea = document.querySelector('#text-area');
         resultArray = [];

         // Run simulation when button is clicked.
         document.querySelector('#roll').addEventListener('click', function () {
            selectedDie = document.querySelector('#select-menu');
            die = selectedDie.value;
            quantity = document.querySelector('#quantity').value;
            groups = document.querySelector('#groups').value;
            iterations = document.querySelector('#iterations').value;

            for (i = 0; i < iterations; i += 1) {
               textArea.textContent += 'Iteration ' + (i + 1) + ' (d' + die + ') ' + '\n';
               simulation.setGroupTotal(0);  // reset the group total
               for (j = 0; j < groups; j += 1) {
                  textArea.textContent += 'Group ' + (j + 1) + '\n';
                  textArea.textContent += quantity + 'd' + die + ': ';
                  simulation.setQuantityTotal(0);  // reset the quantity total
                  resultArray = [];
                  for (k = 0; k < quantity; k += 1) {
                     result = simulation.rollDie(die);
                     resultArray.push(result);
                     //simulation.setQuantityTotal(simulation.getQuantityTotal() + result);
                     textArea.textContent += result;
                  }

                  if (document.querySelector('#modifier-top').checked) {
                     resultArray.sort(function(a, b) {
                        return b - a;
                     });
                     resultArray.pop();
                  }
                  
                  if (document.querySelector('#modifier-bottom').checked) {
                     resultArray.sort();
                     resultArray.pop();
                  }
                  
                  for (l = 0; l < resultArray.length; l += 1) {
                     textArea.textContent += '\n' + resultArray[l];
                     simulation.setQuantityTotal(simulation.getQuantityTotal() + resultArray[l]);
                  }

                  textArea.textContent += '\n' + 'Group total: ' + simulation.getQuantityTotal() + '\n';
                  simulation.setGroupTotal(simulation.getGroupTotal() + simulation.getQuantityTotal());
               }
               textArea.textContent += 'Iteration total: ' + simulation.getGroupTotal() + '\n';
               textArea.textContent += '\n';
            }

         });

         // Results reset button.
         document.querySelector('#results-reset').addEventListener('click', function () {
            textArea.textContent = '';
            simulation.reset();
         });
      }());
   }());
}, false);