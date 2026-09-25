import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, ListTodo } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Check equipment calibration', description: 'Ensure all weather sensors are calibrated to standard specs.', status: 'pending', priority: 'High', due: 'Today 14:00' },
    { id: 2, title: 'Inventory count', description: 'Count remaining emergency rations in Sector 4.', status: 'completed', priority: 'Medium', due: 'Today 10:00' },
    { id: 3, title: 'Secure perimeter fencing', description: 'Reinforce the north-facing wind shields before the storm.', status: 'in-progress', priority: 'High', due: 'Tomorrow 08:00' },
    { id: 4, title: 'Transmit daily logs', description: 'Send the daily scientific observation logs back to HQ.', status: 'pending', priority: 'Low', due: 'Tomorrow 18:00' }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
      }
      return task;
    }));
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-400 bg-red-900/30 border-red-900/50';
    if (priority === 'Medium') return 'text-yellow-400 bg-yellow-900/30 border-yellow-900/50';
    return 'text-blue-400 bg-blue-900/30 border-blue-900/50';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <ListTodo className="w-6 h-6 mr-3 text-blue-500" />
          My Assigned Tasks
        </h2>
        <div className="text-slate-400 text-sm">
          {tasks.filter(t => t.status === 'completed').length} of {tasks.length} completed
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`p-4 rounded-lg border transition-all duration-300 flex items-start gap-4 ${
              task.status === 'completed' 
                ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-600 shadow-lg'
            }`}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className="mt-1 flex-shrink-0 focus:outline-none"
            >
              {task.status === 'completed' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors" />
              )}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {task.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
              </div>
              <p className={`text-sm mb-3 ${task.status === 'completed' ? 'text-slate-600' : 'text-slate-400'}`}>
                {task.description}
              </p>
              <div className="flex items-center text-xs text-slate-500 font-medium">
                {task.status === 'in-progress' ? (
                  <span className="flex items-center text-blue-400 mr-4">
                    <Activity className="w-3 h-3 mr-1" /> In Progress
                  </span>
                ) : null}
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Due: {task.due}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Assuming Activity is needed for in-progress, let's import it correctly above.
import { Activity } from 'lucide-react';

export default Tasks;
