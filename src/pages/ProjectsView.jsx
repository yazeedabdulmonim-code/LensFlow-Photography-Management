import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, Plus, Search, Filter, Clock, CheckCircle2, 
  Users, Camera, Wallet, FileText, ChevronLeft, Eye
} from 'lucide-react';

export const ProjectsView = ({ setActiveTab }) => {
  const { projects, team, tasks, equipment, invoices, clients } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-500" />
            إدارة المشاريع (Projects Pipeline)
          </h1>
          <p className="text-xs text-slate-500">نظرة شاملة على تقدم المشاريع، الميزانيات، وفريق العمل المكلف</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث بالمشروع، العميل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-500"
          />
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
        >
          <option value="All">جميع الحالات</option>
          <option value="In Progress">قيد التنفيذ</option>
          <option value="Planning">في مرحلة التخطيط</option>
          <option value="Completed">مكتمل</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(project => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const projectTeam = team.filter(t => project.assignedTeamIds?.includes(t.id));

          return (
            <div 
              key={project.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/40 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 font-mono">{project.id}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{project.name}</h3>
                  <div className="text-xs text-slate-500">العميل: {project.clientName}</div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                  project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  project.status === 'In Progress' ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {project.status === 'Completed' ? 'مكتمل 100%' : project.status === 'In Progress' ? 'نشط' : 'تخطيط'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">نسبة إنجاز المهام:</span>
                  <span className="text-brand-600 dark:text-brand-400 font-black">{project.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Snippets */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-center">
                <div>
                  <div className="text-[10px] text-slate-400">المهام</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{projectTasks.length} مهمة</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">الميزانية</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{project.budget.toLocaleString()} ريال</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">التسليم</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{project.deliveryDate}</div>
                </div>
              </div>

              {/* Team Avatars & Detail Trigger */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex -space-x-2 space-x-reverse">
                  {projectTeam.map(m => (
                    <img key={m.id} src={m.avatar} alt={m.name} title={m.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900" />
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>عرض التفاصيل والمهام</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Project Overview Drawer Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden p-6 space-y-4">
            
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400">{selectedProject.id}</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">{selectedProject.name}</h3>
                <div className="text-xs text-slate-500">العميل: {selectedProject.clientName}</div>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200">وصف المشروع:</div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Linked Tasks List */}
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">المهام المرتبطة بهذا المشروع:</div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {tasks.filter(t => t.projectId === selectedProject.id).map(t => (
                  <div key={t.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('tasks');
                }}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
              >
                انتقال إلى صفحة المهام
              </button>

              <button onClick={() => setSelectedProject(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl">
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
