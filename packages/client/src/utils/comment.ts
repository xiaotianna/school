import type { Comment } from "@/api/article/type";

// 递归格式化评论数据
export function sortCommentsByHierarchy(comments: Comment[]) {
  // 创建一个映射，方便快速查找评论
  const commentMap = new Map()
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, children: [] })
  })

  // 构建树形结构
  const rootComments: Comment[] = []

  comments.forEach((comment) => {
    const commentNode = commentMap.get(comment.id)

    if (comment.reply_comment === null) {
      // 顶级评论
      rootComments.push(commentNode)
    } else {
      // 子级评论，找到其父评论并添加到children中
      const parentComment = commentMap.get(comment.reply_comment.id)
      if (parentComment) {
        parentComment.children.push(commentNode)
      } else {
        // 如果找不到父评论，则作为顶级评论处理
        rootComments.push(commentNode)
      }
    }
  })

  // 递归扁平化树形结构
  function flattenComments(nodes: Comment[] | any, level = 0): Comment[] {
    let result: Comment[] = []
    nodes.forEach((node: Comment) => {
      (node as any).level = level // 可以记录层级深度
      const { children, ...commentWithoutChildren } = node as any
      result.push(commentWithoutChildren)
      if (children && children.length > 0) {
        result = result.concat(flattenComments(children, level + 1))
      }
    })
    return result
  }

  // 返回重新排序后的评论数组
  return flattenComments(rootComments)
}
