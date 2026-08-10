import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ClipboardCheck, Plus, Search, Filter, Clock, CheckCircle2, 
  AlertTriangle, User, Play, Check, ChevronLeft, LayoutGrid, List
} from 'lucide-react';

export const TasksView = ({ onOpenTaskModal }) => {
  const { tasks, team, updateTaskStatus, toggleChecklistItem } = useApp();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = assigneeFilter === 'All' || t.assigneeId === assigneeFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter(t => t.status === 'Pending');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-brand-500" />
            إدارة المهام (Task Management System)
          </h1>
          <p className="text-xs text-slate-500">متابعة إنجاز الفريق، قوائم التجهيز الميداني، ومواعيد التسليم النهائة</p>
        </div>

        <div className="flex items-center gap-2">
          
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex gap-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'}`}
              title="لوحة كـانبان Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'}`}
              title="عرض قائمة"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenTaskModal}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث بالمهمة، المشروع، الموظف..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">جميع أفراد الفريق</option>
            {team.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">جميع الأولويات</option>
            <option value="High">عالية</option>
            <option value="Medium">متوسطة</option>
            <option value="Low">منخفضة</option>
          </select>
        </div>

      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Pending */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                معلقة ({pendingTasks.length})
              </span>
            </div>

            <div className="space-y-3">
              {pendingTasks.map(t => (
                <TaskCard key={t.id} task={t} team={team} updateTaskStatus={updateTaskStatus} toggleChecklistItem={toggleChecklistItem} />
              ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-brand-50 dark:bg-brand-950/60 rounded-2xl border border-brand-200 dark:border-brand-800">
              <span className="text-xs font-black text-brand-700 dark:text-brand-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
                قيد التنفيذ ({inProgressTasks.length})
              </span>
            </div>

            <div className="space-y-3">
              {inProgressTasks.map(t => (
                <TaskCard key={t.id} task={t} team={team} updateTaskStatus={updateTaskStatus} toggleChecklistItem={toggleChecklistItem} />
              ))}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                مكتملة بنجاح ({completedTasks.length})
              </span>
            </div>

            <div className="space-y-3">
              {completedTasks.map(t => (
                <TaskCard key={t.id} task={t} team={team} updateTaskStatus={updateTaskStatus} toggleChecklistItem={toggleChecklistItem} />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    t.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t.priority === 'High' ? 'عالية' : 'متوسطة'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{t.title}</span>
                </div>
                <div className="text-slate-500">المشروع: {t.projectName} | المكلف: {t.assigneeName}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono">تاريخ التسليم: {t.dueDate}</span>
                
                {t.status === 'Pending' && (
                  <button onClick={() => updateTaskStatus(t.id, 'In Progress')} className="px-3 py-1 bg-brand-600 text-white rounded-lg font-bold">بدء</button>
                )}
                {t.status === 'In Progress' && (
                  <button onClick={() => updateTaskStatus(t.id, 'Completed')} className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold">إكمال</button>
                )}
                {t.status === 'Completed' && (
                  <span className="text-emerald-600 font-bold">مكتملة ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// Reusable Task Card Component
const TaskCard = ({ task, team, updateTaskStatus, toggleChecklistItem }) => {
  const assigneeObj = team.find(t => t.id === task.assigneeId);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-brand-500/40 transition">
      
      <div className="flex justify-between items-start">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
          task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        }`}>
          {task.priority === 'High' ? 'أولوية عالية' : 'متوسطة'}
        </span>

        <span className="text-[10px] text-slate-400 font-mono">{task.dueDate}</span>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">{task.title}</h4>
        <div className="text-[11px] text-slate-500 mt-0.5">{task.projectName}</div>
      </div>

      {/* Checklist Subitems */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400">قائمة المهام الفرعية:</div>
          {task.checklist.map(item => (
            <div 
              key={item.id}
              onClick={() => toggleChecklistItem(task.id, item.id)}
              className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input 
                type="checkbox" 
                checked={item.done}
                readOnly
                className="w-3.5 h-3.5 rounded text-brand-600"
              />
              <span className={item.done ? 'line-through text-slate-400' : ''}>{item.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer Assignee & Status Actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assigneeObj && (
            <img src={assigneeObj.avatar} alt={assigneeObj.name} title={assigneeObj.name} className="w-6 h-6 rounded-full object-cover" />
          )}
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{task.assigneeName}</span>
        </div>

        <div className="flex gap-1">
          {task.status === 'Pending' && (
            <button
              onClick={() => updateTaskStatus(task.id, 'In Progress')}
              className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold rounded-lg transition"
            >
              بدء
            </button>
          )}

          {task.status === 'In Progress' && (
            <button
              onClick={() => updateTaskStatus(task.id, 'Completed')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition"
            >
              إكمال
            </button>
          )}

          {task.status === 'Completed' && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              تم
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
