import React from "react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { QuickOperations } from "@/components/admin/QuickOperations";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import {
  FolderKanban,
  Sparkles,
  MessageSquare,
  PlusCircle,
  Settings,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Code2,
  Briefcase,
  Quote,
  BookOpen,
  Award,
  Eye,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    totalSkills,
    topSkillsCount,
    totalExperiences,
    totalCertificates,
    totalBlogPosts,
    publishedBlogPosts,
    totalTestimonials,
    pendingTestimonials,
    unreadMessages,
    totalMessages,
    totalSubscribers,
    activeSubscribers,
    blogViewsAgg,
    topArticles,
    recentActivities,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.skill.count(),
    prisma.skill.count({ where: { isTopSkill: true } }),
    prisma.experience.count(),
    prisma.certificate.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.testimonial.count(),
    prisma.testimonial.count({ where: { isApproved: false } }),
    prisma.message.count({ where: { isRead: false } }),
    prisma.message.count(),
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { isActive: true } }),
    prisma.blogPost.aggregate({ _sum: { views: true } }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, views: true, category: true },
    }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const totalViews = blogViewsAgg._sum.views || 0;
  const maxArticleViews = Math.max(...topArticles.map((a) => a.views), 1);
  const totalDatabaseRecords =
    totalProjects +
    totalSkills +
    totalExperiences +
    totalCertificates +
    totalBlogPosts +
    totalTestimonials +
    totalMessages +
    totalSubscribers;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Command Center v7.0 Zenith</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Executive CMS Dashboard
          </h2>
          <p className="text-on-surface-variant text-xs md:text-sm mt-1">
            Oversee portfolio systems, technical publications, credentials, skills matrix, subscriber audiences, and telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/blog"
            className="glow-btn-primary px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            <span>New Article</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="glass-btn-secondary px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline/30 transition-all flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Pending Testimonials Alert Banner (if any) */}
      {pendingTestimonials > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-on-surface">
                {pendingTestimonials} Colleague Endorsement{pendingTestimonials > 1 ? "s" : ""} Pending Review
              </p>
              <p className="text-[11px] text-on-surface-variant">
                New peer recommendations submitted via alinets.com/testimonials require administrative approval.
              </p>
            </div>
          </div>
          <Link
            href="/admin/testimonials"
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-300 font-bold text-xs uppercase tracking-wider transition-colors flex-shrink-0"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Expanded Stats Grid (6 KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Projects"
          value={totalProjects}
          icon={FolderKanban}
          colorScheme="primary"
          subtitle={`${publishedProjects} Live / Published`}
        />
        <StatCard
          title="Articles & Research"
          value={totalBlogPosts}
          icon={BookOpen}
          colorScheme="tertiary"
          subtitle={`${publishedBlogPosts} Published`}
        />
        <StatCard
          title="Article Reads"
          value={totalViews}
          icon={Eye}
          colorScheme="secondary"
          subtitle="Cumulative Viewers"
        />
        <StatCard
          title="Subscribers"
          value={totalSubscribers}
          icon={Mail}
          colorScheme="primary"
          subtitle={`${activeSubscribers} Active Feed`}
        />
        <StatCard
          title="Endorsements"
          value={totalTestimonials}
          icon={Quote}
          colorScheme="tertiary"
          subtitle={`${pendingTestimonials} Pending Approval`}
        />
        <StatCard
          title="Unread Messages"
          value={unreadMessages}
          icon={MessageSquare}
          colorScheme="secondary"
          subtitle={`${totalMessages} Total Received`}
        />
      </div>

      {/* V7 Zenith Quick Operations & Platform Maintenance */}
      <QuickOperations totalRecords={totalDatabaseRecords} />

      {/* Analytics & Content Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top 5 Most Read Articles with Visual Horizontal Bar Chart (Col 6) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-outline/25 flex flex-col h-[480px]">
          <div className="flex justify-between items-center mb-4 border-b border-outline/20 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span>Most-Read Publications &amp; Research</span>
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Ranked by real reader page views
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1"
            >
              <span>Manage Blog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {topArticles.length === 0 ? (
              <div className="text-center py-16 text-on-surface-variant text-xs">
                No articles published yet.
              </div>
            ) : (
              topArticles.map((art, idx) => {
                const percentage = Math.max(Math.round((art.views / maxArticleViews) * 100), 8);
                return (
                  <div key={art.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 max-w-[75%]">
                        <span className="font-mono text-primary font-bold text-xs">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-on-surface truncate">
                          {art.title}
                        </span>
                      </div>
                      <span className="font-mono text-secondary font-bold text-xs flex-shrink-0">
                        {art.views.toLocaleString()} views
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? "bg-primary shadow-[0_0_10px_rgba(109,40,217,0.5)]"
                            : idx === 1
                            ? "bg-secondary"
                            : "bg-tertiary/70"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Real-Time Audit Trail & Activity (Col 6) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-outline/25 flex flex-col h-[480px]">
          <div className="flex justify-between items-center mb-4 border-b border-outline/20 pb-3">
            <h3 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Real-Time Audit Trail &amp; Activity</span>
            </h3>
            <span className="text-[11px] font-mono text-on-surface-variant">
              Live Feed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentActivities.length === 0 ? (
              <div className="text-center py-16 text-on-surface-variant text-xs">
                No activity logs recorded yet.
              </div>
            ) : (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex gap-3 items-start p-3 rounded-2xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline/15"
                >
                  <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 text-secondary border border-outline/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-on-surface">
                      <span className="font-mono text-primary font-bold">
                        [{act.action}]
                      </span>{" "}
                      {act.details}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-mono mt-1">
                      {formatRelativeTime(act.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Contact Messages Preview */}
      <div className="glass-panel rounded-3xl p-6 border border-outline/25">
        <div className="flex justify-between items-center mb-4 border-b border-outline/20 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-on-surface">
              Latest Inquiries &amp; Transmissions
            </h3>
            <p className="text-xs text-on-surface-variant">
              Incoming communications from alinets.com/contact
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
          >
            <span>View All Messages ({totalMessages})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-8 text-center text-xs text-on-surface-variant">
            No contact messages received yet.
          </div>
        ) : (
          <div className="divide-y divide-outline/10">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
              >
                <div>
                  <p className="text-xs font-bold text-on-surface flex items-center gap-2">
                    <span>{msg.senderName}</span>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      &lt;{msg.senderEmail}&gt;
                    </span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-tertiary/15 text-tertiary border border-tertiary/30">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                    {msg.message}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-on-surface-variant/70">
                  {formatRelativeTime(msg.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
